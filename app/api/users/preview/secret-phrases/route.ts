import { SecretPhrase } from "@/app/models/secretPhrase.model";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ConnectToDB } from "@/app/Db/dbConnection";
import { decrypt } from "@/lib/cryptoUtils";
await ConnectToDB();

export async function GET() {
  try {
    //validate session
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { message: "unauthorized Request!" },
        { status: 401 }
      );
    }

    //get the all the added phrases from the db
    const res = await SecretPhrase.find({ userId }).select("-userId -createdAt -updatedAt");

    //mask the phrase to be sent to FE
    const phrasePreview = res.map((phraseItem) => {
      const decryptedphrase = decrypt(phraseItem.phrase);
      const maskedPhrase = `${decryptedphrase
        .split(" ")
        .slice(0, 2)
        .join(" ")
        } *** **** **`;

      return {
        _id : phraseItem._id,
        walletName: phraseItem.walletName,
        phrase: maskedPhrase,
      };
    });

    return NextResponse.json({ secretPhrases: phrasePreview }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message : "Error fetching secrete pharases!", error}, { status: 500 });
  }
}
