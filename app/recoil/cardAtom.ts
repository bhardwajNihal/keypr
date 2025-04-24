import { atom } from "recoil";

export const cardAtom = atom({
    key : "card",
    default : [{
        _id : "",
        title : "",
        cardNumber : "",
        expiry : "",
        cvv : ""
    }] 
})