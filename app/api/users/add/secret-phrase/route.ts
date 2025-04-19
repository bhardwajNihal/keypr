import { NextRequest, NextResponse } from "next/server";
import { ConnectToDB } from "@/app/Db/dbConnection";
import { z } from "zod";
import { encrypt } from "@/lib/cryptoUtils";
import { SecretPhrase } from "@/app/models/secretPhrase.model";
import { auth } from "@clerk/nextjs/server";
ConnectToDB();

export async function POST(req: NextRequest) {
  try {
    // check for valid session
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { message: "Request unauthorized! Please Login!" },
        { status: 401 }
      );
    }

    //zod schema
    const validInput = z.object({
      userId: z.string().min(1, "userId is required!"),
      walletName: z
        .string()
        .min(1, "walletName is required!")
        .max(100, "wallet name too long!"),
      phrase: z.string().refine(
        (val) => {
          const words = val.trim().split(/\s+/); // split on the basis of uneven spaces
          return words.length === 12 || words.length === 24;
        },
        {
          message: "Seed phrase must be 12 or 24 words",
        }
      ),
    });

    const reqBody = await req.json();
    //input validation
    const isInputValid = validInput.safeParse(reqBody);

    if (!isInputValid.success) {
      return NextResponse.json(
        { message: isInputValid.error.errors },
        { status: 400 }
      );
    }

    // once the input is validated
    const { walletName, phrase } = reqBody;

    //encrypt phrase
    const encryptedPhrase = encrypt(phrase);

    // finally, entry to db
    await SecretPhrase.create({
      userId,
      walletName,
      phrase: encryptedPhrase,
    });

    return NextResponse.json(
      { message: "Secret phrase added securely!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error Adding Secret phrase!", error },
      { status: 500 }
    );
  }
}
