import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import VaultTabs from "../components/tabsComp/tabs"
import { Pin } from "../models/securityPin.model"
import { ConnectToDB } from "../Db/dbConnection"
await ConnectToDB();

const Dashboard = async() => {

    const { userId } = await auth()
    if (!userId) {
      redirect("/")
    }
    const foundPin = await Pin.findOne({ userId });

    if(!foundPin) redirect("/generate-pin")

  return (
    <div className="min-h-screen w-full container mx-auto px-8 md:px-8 lg:px-16">

      <VaultTabs />
    </div>
  )
}

export default Dashboard