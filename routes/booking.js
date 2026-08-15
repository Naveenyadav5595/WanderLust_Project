const express = require("express");
const router = express.Router();

const Booking = require("../models/booking");
const Listing = require("../models/listing");
const bookingControllers=require("../controllers/booking.js");

const { isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

router.post("/",isLoggedIn,wrapAsync(bookingControllers.booking));
router.post( "/verify",isLoggedIn,wrapAsync(bookingControllers.verifyPayment));
// rote to get all bookings
router.get("/",isLoggedIn,wrapAsync(bookingControllers.myBookings));

router.get(
    "/:bookingId/success",
    isLoggedIn,
    wrapAsync(bookingControllers.paymentSuccess)
);

// route to view booking details in booking
router.get("/:bookingId",isLoggedIn,wrapAsync(bookingControllers.viewBooking));
// route to cancel booking
router.delete("/:bookingId/cancel",isLoggedIn,wrapAsync(bookingControllers.cancelBooking));
//route to remove canceleld/completed booking
router.delete("/:bookingId/remove",isLoggedIn,wrapAsync(bookingControllers.removeBooking));
module.exports=router;