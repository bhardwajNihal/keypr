// will be using resend to send emails
import bcrypt from "bcrypt";
import { ConnectToDB } from "../Db/dbConnection";
import { auth } from "@clerk/nextjs/server";
import { Pin } from "../models/securityPin.model";
import {Resend} from 'resend'

ConnectToDB();

// resend instance
const resend = new Resend(process.env.RESEND_API_KEY);

//function to send email
export async function SendEmail(email: string | undefined) {
    
  // check if email provided
  if (!email) throw new Error("Email is required.");

  // verify session
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Unauthorized Request")
    }

    // hash a token >> store it to db assigning an expiry
    const hashedToken = await bcrypt.hash(userId.toString(), 10);
    
    await Pin.findOneAndUpdate(
      { userId },
      {
        forgetPinToken: hashedToken,
        forgetPinExpiry: Date.now() + 3600000, //1 hr
      }
    );

    // finally send email using resend instance

    const resetLink = `${process.env.NEXT_PUBLIC_DOMAIN}/reset-pin?token=${hashedToken}`;

    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: 'Reset your PIN',
      html: `
        <p>Click 
          <a href="${resetLink}" style="color: white; background: #7e22ce; padding: 10px 15px; border-radius: 6px; text-decoration: none;">
            here
          </a> 
          to reset your PIN.
        </p>
        <br />
        <p>Or copy and paste this link in your browser:</p>
        <code>${resetLink}</code>
      `,
    });

    return response;

  } catch (error) {
    throw new Error("Error sending email!" + error);
  }
}
