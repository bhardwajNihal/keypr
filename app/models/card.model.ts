
import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    userId : {type:String, required: true},
    title : {type :String, required: true},
    CardHolderName : {type:String, required:true},
    cardNumber : {type:String, required:true, trim:true},
    expiry : {type:String, required:true, trim:true},
    cvv : {type:String, required:true, trim:true}
},{timestamps:true});

export const Card = mongoose.models.Card || mongoose.model("Card", cardSchema);