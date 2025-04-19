import mongoose from "mongoose";

const secretPhraseSchema = new mongoose.Schema({
    userId : {type:String, required:true},
    walletName : {type:String, required:true},
    phrase : {type:String, required:true, trim:true},
}, {timestamps:true});

export const SecretPhrase = mongoose.models.SecretPhrase || mongoose.model("SecretPhrase",secretPhraseSchema);