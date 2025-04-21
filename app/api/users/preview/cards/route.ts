import { Card } from "@/app/models/card.model";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ConnectToDB } from "@/app/Db/dbConnection";
import { decrypt } from "@/lib/cryptoUtils";
await ConnectToDB();


export async function GET() {
    
    try {
        // validate session
        const {userId} = await auth();
        if(!userId){
            return NextResponse.json({message : "unauthorized Request!"}, {status:401});
        }
    
        //once validated fetch the added cards from the db
    
        const res = await Card.find({userId}).select("-userId -CardHolderName -createdAt -updatedAt");
    
        // now, decrypt the encrpypted info
            // then mask sensitive info for preview
        const cardPreviews = res.map(cardItem => {
            const cardNum = decrypt(cardItem.cardNumber);
            const expiry = decrypt(cardItem.expiry);
            const cvv = decrypt(cardItem.cvv);
    
            const maskedCardNum = cardNum.replace(/\d(?=\d{4})/g, "x"); // replace all those digits with star, who have 4 digits to the left
            let maskedCvv;
    
            if(cvv.length===3){
                maskedCvv = `**${cvv.slice(2)}`
            }else{
                maskedCvv = `***${cvv.slice(3)}`
            }
    
            //finally returning the info in the form in which to be previewed
            return {
                _id : cardItem._id,
                title : cardItem.title,
                cardNumber : maskedCardNum,
                expiry,
                cvv : maskedCvv
            }
        })
    
        return NextResponse.json({cards : cardPreviews})
    } catch (error) {
        return NextResponse.json({message : "Error fetching cards!", error}, {status:500});
    }
}