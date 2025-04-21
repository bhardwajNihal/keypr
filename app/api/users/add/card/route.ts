import { z } from "zod";
import { ConnectToDB } from "@/app/Db/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import { Card } from "@/app/models/card.model";
import { encrypt } from "@/lib/cryptoUtils";
import { auth } from "@clerk/nextjs/server";

ConnectToDB();

export async function POST(req: NextRequest) {
  try {

    // check for valid session
    const {userId} = await auth();
    if(!userId){
      return NextResponse.json({message : "Request unauthorized! Please Login!"}, {status:401});
    }

    // zod schema
    const validInput = z.object({
      title : z.string().min(1,"title is required!").max(100,"title too long!"),
        CardHolderName: z
        .string()
        .min(3, "Name should be atleast of 3 characters!")
        .max(100, "Name is too long!"),
      cardNumber: z.string().regex(/^\d{12,19}$/, "Card number must be 12 to 19 digits"),
      expiry: z
        .string()
        .regex(/^(0[1-9]|1[0-2])\d{2}$/, "Expiry must be in MMYY format"),
      cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
    });

    // validate input
    const reqBody = await req.json();

    const isInputValid = validInput.safeParse(reqBody);

    if (!isInputValid.success) {
      return NextResponse.json(
        { message: isInputValid.error.errors },
        { status: 400 }
      );
    }

    // once the input is safely validated
    const { title, CardHolderName, cardNumber, expiry, cvv } = reqBody;

    // encrypting the sensitive data
    const encryptedCardNumber = encrypt(cardNumber);
    const encryptedExpiry = encrypt(expiry);
    const encryptedCvv = encrypt(cvv)

    // finally add entry to db
    await Card.create({
      userId,
      title,
      CardHolderName,
      cardNumber: encryptedCardNumber,
      expiry : encryptedExpiry,
      cvv: encryptedCvv,
    });

    return NextResponse.json(
      { message: "Card details added successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error adding card details!", error: error },
      { status: 500 }
    );
  }
}
