import { SendEmail } from "@/app/emailSetup/mailer";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    
    try {
        const {userId} = await auth();
        
        if(!userId){
            return NextResponse.json({message : "Request Unauthorized!"},{status:401});
        }
    
        const {email} = await req.json();
    
        await SendEmail(email);
    
        return NextResponse.json({message : "Email Sent successfully! Reset your Pin."},{status:200});
    } catch (error) {
        return NextResponse.json({message : "Error while sending Email!",error},{status:500});
    }
}