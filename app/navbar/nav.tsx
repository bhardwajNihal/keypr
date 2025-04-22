
"use client"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { MdVpnKey } from "react-icons/md";

import { MenuIcon, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/app/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"

export default function Navbar() {

    const {setTheme} = useTheme()

    return <nav className="flex justify-between items-center h-16 center px-6 md:px-8 lg:px-16 container mx-auto border-b border-muted">
        <div className="logo font-bold text-xl w-16 relative flex items-center"><span>Keyp</span><MdVpnKey className="rotate-270 font-bold absolute top-2 right-0" /></div>
        
        <div className="text-purple-100"><MenuIcon className="sm:hidden"/></div>

        <div className="options className sm:flex gap-8 items-center text-sm hidden sm:block">

            <SignedOut>
                <ul className="flex items-center gap-4">
                    <li className="hover:underline cursor-pointer">Home</li>
                    <li className="hover:underline cursor-pointer">About</li>
                    <li className="hover:underline cursor-pointer">Services</li>
                </ul>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                        System
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
                <div className="bg-purple-700 px-6 rounded py-1 text-white hover:bg-purple-600"><SignInButton /></div>
            </SignedOut>
            <SignedIn>

                <ul className="flex gap-4 items-center  ">
                    <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                        System
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
                </ul>
                <UserButton />
            </SignedIn>
        </div>
    </nav>
}