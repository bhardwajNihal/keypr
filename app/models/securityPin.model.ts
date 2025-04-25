
import mongoose from "mongoose";

const pinSchema = new mongoose.Schema({
    userId : {type:String, required:true},
    pin : {type : String, required : true},
    forgetPinToken : {type : String},
    forgetPinExpiry : {type : String}
},{timestamps:true})

export const Pin = mongoose.models.Pin || mongoose.model("Pin", pinSchema)