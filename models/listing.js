const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const listingSchema=new Schema({
    title:{
       type:String,
       required: true,
    },
    description:String,
    image: {
        filename:String,
        url:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry: {
       type: {
          type: String,
          enum: ["Point"],
         default: "Point"
       },
       coordinates: {
         type: [Number],
         default: [0, 0]
        }
    },
    category: {
        type: [String],
        enum: [ "Trendings","Rooms","Iconic Cities", "Mountains","Castles","Pools", "Campings", "Farms","Arctics","Beachs"],
        default: [],
    },
}); 

// if we delete listing, this will make sure all reviews of it also got deleted 
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing; 
