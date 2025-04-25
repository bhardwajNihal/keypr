
import { NextRequest, NextResponse } from "next/server";
import { Pin } from "@/app/models/securityPin.model";
import bcrypt from "bcrypt";

export async function PUT(req: NextRequest) {
  try {
  
    const { token, pin } = await req.json();
    
    // verify if the pin exists with the given token
    const foundPin = await Pin.findOne({forgetPinToken : token});
    if(!foundPin){
      return NextResponse.json({message : "Token invalid! Can't process request!"})
    }

    // hashpin 
    const hashedPin = await bcrypt.hash(pin,10);
    await Pin.findByIdAndUpdate(
      { _id: foundPin._id },
      {
        pin:hashedPin,
        forgetPinToken: null,
        forgetPinExpiry: null,
      }
    );
  
    return NextResponse.json({message : "Pin successfully Updated!"})
  } catch (error) {
    return NextResponse.json({message : "Error reseting pin", error})
  }
}
