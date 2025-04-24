import { Password } from "@/app/models/password.model";
import { Pin } from "@/app/models/securityPin.model";
import { decrypt } from "@/lib/cryptoUtils";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(req: NextRequest, { params }: any) {
  try {
    const { id } = await params;
    
    // check for valid session
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { message: "unauthorized request! please login!" },
        { status: 401 }
      );
    }

    const foundUser = await Pin.findOne({
      userId,
    });
    
    //validate pin
    const { pin } = await req.json();
    
    const isPinCorrect = await bcrypt.compare(pin,foundUser.pin)
    
    if (!isPinCorrect) {
      return NextResponse.json(
        { message: "Access denied! Incorrect Pin!" },
        { status: 401 }
      );
    }

    // if pin validated return decrypted response
    const res = await Password.findOne({ _id: id });

    const PasswordDetails = {
      site: res.site,
      username: decrypt(res.username),
      password: decrypt(res.password),
    };
    
    return NextResponse.json({ PasswordDetails }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching password details!" ,error},
      { status: 500 }
    );
  }
}