import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ConnectToDB } from "@/app/Db/dbConnection";
import { SecretPhrase } from "@/app/models/secretPhrase.model";

ConnectToDB();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req:NextRequest, { params }: any) {
  try {
    // check if session valid
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { message: "Request unauthorized!" },
        { status: 401 }
      );
    }
  
    const {id} = params;
  
    // once authorized delete entry from db
    await SecretPhrase.findOneAndDelete({userId,_id:id});
  
    return NextResponse.json({message : "Secret phrase deleted Successfully!"},{status:200});
    
  } catch (error) {
    return NextResponse.json({message : "Error deleting Secret phrase!", error},{status:500});
  }

}
