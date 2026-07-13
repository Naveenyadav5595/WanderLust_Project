const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("DB connection error:", err);
  });
async function main(){
    await mongoose.connect(MONGO_URL);
}
const initDB= async ()=>{
    await Listing.deleteMany({}); // pre data ko delete kardo
    initData.data=initData.data.map((obj)=>({...obj,owner:"6a4f3bda35612e5a133415f0"}));
    await Listing.insertMany(initData.data); // inserting our data
    console.log("Data was initialized");
}
initDB();
