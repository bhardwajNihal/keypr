import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ConnectToDB } from "@/app/Db/dbConnection";
import { Card } from "@/app/models/card.model";

ConnectToDB();

export async function DELETE(req:NextRequest) {
  try {
    // check if session valid
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { message: "Request unauthorized!" },
        { status: 401 }
      );
    }
  
    const {cardId} = await req.json();
  
    // once authorized delete entry from db
    await Card.findOneAndDelete({userId, _id:cardId});
  
    return NextResponse.json({message : "Card deleted Successfully!"},{status:200});
  } catch (error) {
    return NextResponse.json({message : "Error deleting Card!", error},{status:500});
  }

}
