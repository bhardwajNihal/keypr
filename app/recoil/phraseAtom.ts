import { atom } from "recoil";

export const phraseAtom = atom({
    key : "card",
    default : {
        _id : "",
        walletName : "",
        phrase : ""
    } 
})