import { Password } from "@/app/models/password.model";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ConnectToDB } from "@/app/Db/dbConnection";
import { decrypt } from "@/lib/cryptoUtils";
await ConnectToDB();


export async function GET(){

    try {
        //validate session
        const {userId} = await auth();
            if(!userId){
                return NextResponse.json({message : "unauthorized Request!"}, {status:401});
            }
        
        // fetch passwords from the db
        const res = await Password.find({userId}).select("-userId -createdAt -updatedAt");
    
        // create data preview format
        const passwordPreviews = res.map(passwordItem => {
    
            const decryptedUsername = decrypt(passwordItem.username);
            const maskedUsername = `${decryptedUsername.slice(0,2)}*****${decryptedUsername.slice(decryptedUsername.length-1)}`;
    
            // not masking password, I don't want to show anything of it
    
            return {
                _id : passwordItem._id,
                site : passwordItem.site,
                username : maskedUsername,
                password : "********"
            }
        })
    
        return NextResponse.json({passwords : passwordPreviews})
    } catch (error) {
        return NextResponse.json({message : "Error fetching saved passwords!", error}, {status:500});
    }
    
}