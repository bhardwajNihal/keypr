
import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema({
    userId : {type:String, required:true},
    site : {type:String, required:true},
    username : {type:String, required:true,trim:true},
    password : {type:String, required:true,trim:true},
},{timestamps:true});

export const Password = mongoose.models.Password || mongoose.model("Password",passwordSchema);