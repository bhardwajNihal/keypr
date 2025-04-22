import { SecretPhrase } from "@/app/models/secretPhrase.model";
import { Pin } from "@/app/models/securityPin.model";
import { decrypt } from "@/lib/cryptoUtils";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

interface paramsType {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: paramsType) {
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

    const isPinCorrect = await bcrypt.compare(pin, foundUser.pin);

    if (!isPinCorrect) {
      return NextResponse.json(
        { message: "Access denied! Incorrect Pin!" },
        { status: 401 }
      );
    }

    // if pin validated return decrypted response
    const res = await SecretPhrase.findOne({ _id: id });

    const phraseDetails = {
      walletName: res.walletName,
      phrase: decrypt(res.phrase),
    };

    return NextResponse.json({ phraseDetails }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching Secret phrase!", error },
      { status: 500 }
    );
  }
}
