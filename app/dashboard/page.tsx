import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import VaultTabs from "../components/tabsComp/tabs"

const Dashboard = async() => {

    const {userId} = await auth()

    if(!userId){
        redirect("/")
    }
    
  return (
    <div className="min-h-screen w-full container mx-auto px-8 md:px-24">

        <VaultTabs/>
    </div>
  )
}

export default Dashboard