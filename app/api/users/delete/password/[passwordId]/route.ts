import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ConnectToDB } from "@/app/Db/dbConnection";
import { Password } from "@/app/models/password.model";

ConnectToDB();

interface paramsType{
  params : {passwordId : string};
}

export async function DELETE(req:NextRequest, {params}: paramsType) {
  try {
    // check if session valid
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { message: "Request unauthorized!" },
        { status: 401 }
      );
    }
  
    const {passwordId} = params;
  
    // once authorized delete entry from db
    await Password.findOneAndDelete({userId, _id:passwordId});
  
    return NextResponse.json({message : "Password deleted Successfully!"},{status:200});

  } catch (error) {
    return NextResponse.json({message : "Error deleting Password!", error},{status:500});
  }

}
