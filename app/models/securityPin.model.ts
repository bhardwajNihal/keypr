
import mongoose from "mongoose";

const pinSchema = new mongoose.Schema({
    userId : {type:String, required:true},
    pin : {type : String, required : true}
},{timestamps:true})

export const Pin = mongoose.models.Pin || mongoose.model("Pin", pinSchema)