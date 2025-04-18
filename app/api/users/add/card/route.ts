import { z } from "zod";
import { ConnectToDB } from "@/app/Db/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import { Card } from "@/app/models/card.model";
import bcrypt from "bcrypt";

ConnectToDB();

export async function POST(req: NextRequest) {
  try {
    // zod schema
    const validInput = z.object({
      userId: z.string().min(1, "userId is required!"),
      name: z
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
    const { userId, name, cardNumber, expiry, cvv } = reqBody;

    // check if card already added

    const isCardAdded = await Card.findOne({ cardNumber });

    if (isCardAdded) {
      return NextResponse.json(
        { message: "Card already added!" },
        { status: 400 }
      );
    }

    //hash the number, and cvv
    const hashedCardNumber = await bcrypt.hash(cardNumber, 10);
    const hashedExpiry = await bcrypt.hash(expiry, 10);
    const hashedCvv = await bcrypt.hash(cvv, 10);

    // finally add entry to db
    await Card.create({
      userId,
      name,
      cardNumber: hashedCardNumber,
      expiry : hashedExpiry,
      cvv: hashedCvv,
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
