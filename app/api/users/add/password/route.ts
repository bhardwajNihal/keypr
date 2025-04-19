import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ConnectToDB } from "@/app/Db/dbConnection";
import { Password } from "@/app/models/password.model";
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

    //zod schema
    const validInput = z.object({
      userId: z.string().min(1, "userId is required!"),
      site: z
        .string()
        .min(1, "site/app name is required!")
        .max(100, "Site name should be precise!"),
      username: z
        .string()
        .min(1, "username is required!")
        .max(100, "Username is too long!"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must include at least one uppercase letter")
        .regex(/[a-z]/, "Password must include at least one lowercase letter")
        .regex(/\d/, "Password must include at least one number")
        .regex(
          /[@$!%*?&]/,
          "Password must include at least one special character"
        ),
    });

    const reqBody = await req.json();
    // input validation
    const isInputValid = validInput.safeParse(reqBody);

    if (!isInputValid.success) {
      return NextResponse.json(
        { message: isInputValid.error.errors },
        { status: 400 }
      );
    }

    // once input is successfully validated
    const { site, username, password } = reqBody;

    // hash password
    const encryptedPassword = encrypt(password)
    // entry to db
    await Password.create({
      userId,
      site,
      username,
      password: encryptedPassword,
    });

    return NextResponse.json(
      { message: "Password Added successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error adding password!", error },
      { status: 500 }
    );
  }
}
