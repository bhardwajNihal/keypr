import { atom } from "recoil";

export const passwordAtom = atom({
    key : "card",
    default : {
        _id: "",
        site: "",
        username: "",
        password: ""
    } 
})