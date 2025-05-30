
import mongoose from "mongoose"

export async function ConnectToDB() {
    if (mongoose.connection.readyState >= 1) {
        return;         // check if db already connected, return if its anything other than disconnected
      }
    try {
        await mongoose.connect(`${process.env.DB_CONNECTION_STRING}/keypr-password-manager`);
        console.log("Db connected Successfully!");
    } catch (error) {
        console.error("Error connecting to Db!", error);
        process.exit(1);
    }
}