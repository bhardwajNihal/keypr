import { Pin } from "@/app/models/securityPin.model";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { ConnectToDB } from "@/app/Db/dbConnection";
ConnectToDB();

export async function POST(req: NextRequest) {
  try {
    const validInput = z.object({
      userId: z.string().min(1, "UserId is required"),
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
    // once the input is validated >> hash >> store/update to db
    const { userId, pin } = reqBody;
    const hashedPin = await bcrypt.hash(pin, 10);

    //check if pin for the user already exists
    const foundPin = await Pin.findOne({ userId });

    if (foundPin) {
      return NextResponse.json({ message: "pin is already set!" });
    }

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
