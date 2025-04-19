import { Pin } from "@/app/models/securityPin.model";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { ConnectToDB } from "@/app/Db/dbConnection";
import { auth } from "@clerk/nextjs/server";
ConnectToDB();

export async function POST(req: NextRequest) {
  try {

    // check for valid session
        const {userId} = await auth();
        if(!userId){
          return NextResponse.json({message : "Request unauthorized! Please Login!"}, {status:401});
        }

    //zod schema
    const validInput = z.object({
      pin: z.string().length(4).regex(/^\d+$/, "PIN must be numeric"),
    });

    const reqBody = await req.json();

    const isInputValid = validInput.safeParse(reqBody);
    // console.log(isInputValid.error?.errors[1].message);

    if (!isInputValid.success) {
      return NextResponse.json(
        { message: isInputValid.error?.errors },
        { status: 400 }
      );
    }
    // once the input is validated >> hash >> store
    const { pin } = reqBody;

    //check if pin for the user already exists
    const foundPin = await Pin.findOne({ userId });

    if (foundPin) {
      return NextResponse.json({ message: "pin is already set!" });
    }

    const hashedPin = await bcrypt.hash(pin, 10);

    await Pin.create({
      userId,
      pin: hashedPin,
    });

    return NextResponse.json(
      { message: "Pin set Successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error setting Pin!", error: error },
      { status: 500 }
    );
  }
}
