const Listing=require("../models/listing.js");
const Booking=require("../models/booking.js");
const crypto = require("crypto");

const Razorpay = require("razorpay");
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

module.exports.booking=async (req,res)=>{ 
    // Cancel unpaid bookings older than 15 minutes
       await Booking.updateMany({status: "pending",paymentStatus: "pending",createdAt: {$lt: new Date(Date.now() - 15 * 60 * 1000)}},
           {$set: {status: "cancelled",paymentStatus: "failed"}}
       );
       const {listingId, checkIn, checkOut, guests} = req.body;
       const numberOfGuests = Number(guests);
       const listing = await Listing.findById(listingId);
        if (!listing) {
           req.flash("error", "Listing not found");
           return res.redirect("/listings");
        }
        const newCheckIn = new Date(checkIn);
        const newCheckOut = new Date(checkOut);
        if (isNaN(newCheckIn.getTime()) ||isNaN(newCheckOut.getTime())) {
            req.flash("error", "Please enter valid check-in and check-out dates.");
            return res.redirect(`/listings/${listingId}/checkAvailability` );
        }
        if (newCheckIn >= newCheckOut) {
           req.flash( "error","Check-out must be after check-in.");
           return res.redirect( `/listings/${listingId}/checkAvailability`);
        }
        if (!Number.isInteger(numberOfGuests) || numberOfGuests < 1) {
            req.flash( "error", `Atleast 1 guest should be present`);
            return res.redirect( `/listings/${listingId}/checkAvailability`);
        }
        const bookings = await Booking.find({
               listing: listingId,
               status: { $in: ["pending", "confirmed"]}
        });
        const isOverlapping = bookings.some((booking) => {
          return (
               newCheckIn < booking.checkOut &&
               newCheckOut > booking.checkIn
            );
        });
        if (isOverlapping) {
            req.flash( "error", "Sorry, these dates are no longer available.");
            return res.redirect(`/listings/${listingId}/checkAvailability`);
        }
        const timeDifference =newCheckOut - newCheckIn;
        const nights = Math.ceil(timeDifference /(1000 * 60 * 60 * 24));
        const totalPrice = listing.price * nights;
        // created new booking
        const booking = new Booking({
                user: req.user._id,
                listing: listingId,
                checkIn: newCheckIn,
                checkOut: newCheckOut,
                guests: numberOfGuests,
                totalPrice,
                status: "pending",
                paymentStatus: "pending"
        });
        await booking.save();
        const options = {
            amount: totalPrice * 100,
            currency: "INR",
            receipt: booking._id.toString()
        };
        try{
            const order = await razorpay.orders.create(options);
            booking.razorpayOrderId = order.id;
            await booking.save();
            return res.render("bookings/payment.ejs", {booking,listing, order, razorpayKeyId: process.env.RAZORPAY_KEY_ID});
        } catch (error) {
            console.log("========== RAZORPAY ERROR ==========");
            console.log("Message:", error.message);
            console.log("Error:", error);
            console.log("====================================");
           req.flash("error", "Payment service error. Please try again.");
           return res.redirect(`/listings/${listingId}/checkAvailability`);
        }
};

module.exports.verifyPayment = async (req, res) => {
  try{
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body;
    // verify if payment details are not correct show msg
    if (!razorpay_order_id ||!razorpay_payment_id ||!razorpay_signature) {
        return res.status(400).json({
            success: false,
            message: "Invalid payment details"
        });
    }
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac(
            "sha256",
            process.env.RAZORPAY_KEY_SECRET
        )
        .update(body)
        .digest("hex");
    if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
            success: false,
            message: "Payment verification failed"
        });
    }
    const booking = await Booking.findOne({
        razorpayOrderId: razorpay_order_id,
        user: req.user._id
    });
    if (!booking) {
        return res.status(404).json({
            success: false,
            message: "Booking not found"
        });
    }
    // check if already paid
    if (booking.paymentStatus === "paid") {
        return res.json({success: true,message: "Payment already verified", bookingId: booking._id});
    }
    // check if this booking already canceleld
    if (booking.status === "cancelled") {
        return res.status(400).json({success: false, message: "This booking has been cancelled"});
    }
    booking.paymentStatus = "paid";
    booking.status = "confirmed";
   booking.razorpayPaymentId = razorpay_payment_id;
   booking.razorpaySignature = razorpay_signature;
    await booking.save();
    return res.json({
        success: true,
        message: "Payment successful",
        bookingId: booking._id
    });
 }catch(error){
    console.error("Payment verification error:", error);
    return res.status(500).json({success: false,message: "Something went wrong while verifying payment"});
 }
};
module.exports.paymentSuccess = async (req, res) => {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId)
        .populate("listing");
    if (!booking) {
        req.flash("error", "Booking not found");
        return res.redirect("/listings");
    }
    res.render("bookings/success.ejs", {
        booking,
        listing: booking.listing
    });
};

// my bookings
module.exports.myBookings=async (req,res)=>{
    await Booking.updateMany({user: req.user._id,status: "confirmed", checkOut: { $lt: new Date() }},{ $set: { status: "completed"}});
    // here we are finding all booking whose user(booked by) by curr logged in user
    // bookings is array og booking
    const bookings = await Booking.find({user: req.user._id, hidden: false}).populate("listing");
    res.render("bookings/index.ejs", {bookings});
};

module.exports.viewBooking= async (req,res)=>{
     const {bookingId}=req.params;
     const booking= await Booking.findOne({ _id: bookingId,user: req.user._id}).populate("listing");
     if(!booking){
        req.flash("error", "Booking not found");
        return res.redirect("/bookings");
     }
    res.render("bookings/details.ejs", {
        booking,
        listing: booking.listing
    });
};

module.exports.cancelBooking= async (req,res)=>{
    const { bookingId } = req.params;
    // find booking whose id=bookingId and user is curr logged in user
    const booking = await Booking.findOne({
        _id: bookingId,
        user: req.user._id
    });
    if (!booking) {
        req.flash("error", "Booking not found");
        return res.redirect("/bookings");
    }
    // booking is already cancelled or completed we acnt cancel it 
    if ( booking.status !== "pending" && booking.status !== "confirmed") {
        req.flash("error", "This booking cannot be cancelled.");
        return res.redirect(`/bookings/${bookingId}`);
    }
    
     // If payment was already made than only hmm refund karenge
    if (booking.paymentStatus === "paid") {
        try {
            const refund = await razorpay.payments.refund(booking.razorpayPaymentId,{amount: booking.totalPrice * 100});
            console.log("Refund created:", refund.id);
            booking.paymentStatus = "refunded";
        }
        catch(err){
            console.log("Refund failed:", err);
            req.flash( "err","Refund could not be processed. Booking was not cancelled." );
            return res.redirect(`/bookings/${bookingId}`);
        }
        
    }
    // only after successful refund
    booking.status = "cancelled";
    await booking.save();
    req.flash("success", "Booking cancelled successfully.");
    return res.redirect(`/bookings/${bookingId}`);
};

// for remove cancelled/comoleted bookings
module.exports.removeBooking = async (req, res) => {
    const { bookingId } = req.params;
    const booking = await Booking.findOne({
        _id: bookingId,
        user: req.user._id
    });
    if (!booking) {
        req.flash("error", "Booking not found.");
        return res.redirect("/bookings");
    }
    // Only cancelled or completed bookings can be removed
    if (booking.status !== "cancelled" && booking.status !== "completed") {
        req.flash("error","Only cancelled or completed bookings can be removed.");
        return res.redirect(`/bookings/${bookingId}`);
    }
    booking.hidden = true;
    await booking.save();
    req.flash("success", "Booking removed from your bookings.");
    return res.redirect("/bookings");
};
