// Nodemailer is a Node.js library that lets us send emails from your server.
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { ConnectToDB } from "../Db/dbConnection";
import { auth } from "@clerk/nextjs/server";
import { Pin } from "../models/securityPin.model";

ConnectToDB();

// basic setup for sending email using nodemailer
export async function SendEmail(email: string | undefined) {
    
  if (!email) throw new Error("Email is required.");

  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Unauthorized Request")
    }

    const hashedToken = await bcrypt.hash(userId.toString(), 10);
    
    await Pin.findOneAndUpdate(
      { userId },
      {
        forgetPinToken: hashedToken,
        forgetPinExpiry: Date.now() + 3600000, //1 hr
      }
    );
    

    // Will be using Mailtrap
    // Mailtrap is a service that catches emails sent from development environments,
    //  so they don’t go to real users. It gives us a sandbox inbox to preview emails safely.
    // configure it , and set user and pass provided,
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
    
    const mailOptions = {
      from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
      to: email, // list of receivers
      subject: "Reset your pin.", // Subject line
      text: "Hello world?", // plain text body
      html: `
      <p>Click 
        <a 
        classname="px-6 py-2 bg-purple-600 text-white rounded"
        href="${process.env.NEXT_PUBLIC_DOMAIN}/reset-pin?token=${hashedToken}">here</a>
        to reset you pin.
      </p> 
      <br />
       OR 
       <br /> 
       Copy paste the link below in your browser tab
       <br/>
       ${process.env.NEXT_PUBLIC_DOMAIN}/reset-pin?token=${hashedToken}`,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    
    return mailResponse;
  } catch (error) {
    throw new Error("Error sending email!" + error);
  }
}
