"use client"

import { FaLock, FaCreditCard, FaKey } from "react-icons/fa";
import { RiShieldKeyholeFill } from "react-icons/ri";
import { motion } from "framer-motion"
import { AuroraBackground } from "./ui/aurora-background";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/app/components/ui/accordion"
import { ContainerTextFlip } from "./ui/container-text-flip";
import { SignUpButton } from "@clerk/nextjs";
import { SignedOut } from "@clerk/clerk-react";

export default function LandingPage() {

    return (
        <main className="min-h-screen bg-background text-foreground ">
            {/* Hero Section */}
            {/* <AuroraBackground> */}
                <section id="home" className="min-h-screen flex flex-col justify-center items-center text-center gap-6 max-w-3xl mx-auto">
                    <motion.h1
                        className="text-4xl md:text-6xl font-extrabold text-purple-400 dark:text-purple-400 px-8"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        Safegaurd Your Digital Presence with <span className="text-purple-600 dark:text-purple-600">Keypr</span>
                    </motion.h1>
                    <p className="text-lg sm:text-2xl text-muted-foreground px-6">Because sticky notes aren&apos;t secure, and memory isn&apos;t forever.</p>

                    <div className=" w-full flex sm:flex-row gap-4 flex-col justify-between items-center text-center px-8 sm:px-16 md:px-24 lg:px-36">
                        <div className="text-foreground ">
                            <span className="text-lg sm:text-xl font-semibold">Store</span><ContainerTextFlip words={["site/app credentials", "debit card details", "credit card details", "crypto secret phrase"]} /><span className="text-lg sm:text-xl font-semibold">.</span>
                        </div>
                        <SignedOut>
                            <SignUpButton mode="redirect">
                                <div className="bg-purple-600 text-white px-6 py-3 cursor-pointer rounded-md hover:bg-purple-700 transition">
                                    Get Started
                                </div>
                            </SignUpButton>
                        </SignedOut>
                    </div>
                </section>
            {/* </AuroraBackground> */}

            {/* Features Section */}
            <section id="features" className="mt-20 grid gap-10 md:grid-cols-2 px-4 sm:px-8 md:px-16 lg:px-40">
                <FeatureCard
                    icon={<FaLock size={28} />}
                    title="Store Passwords"

                    description="Save and manage Credentials for websites and apps. Now create strong passwords without hassle of remembering them."
                />
                <FeatureCard
                    icon={<FaCreditCard size={28} />}
                    title="Secure Card Storage"
                    description="Safely store your credit/debit card details with encryption and masked previews."
                />
                <FeatureCard
                    icon={<FaKey size={28} />}
                    title="Seed Phrase Protection"
                    description="Ever heard that you are screwed if you ever lose the seed phrase of your crypto wallet. Not anymore, store is here securely, encrypted and only accessed by you via pin."
                />
                <FeatureCard
                    icon={<RiShieldKeyholeFill size={28} />}
                    title="Server Side Encryption"
                    description="All sensitive data is encrypted before being stored to Database. Securely locked via pin, making sure its only you who can access."
                />
            </section>

            {/* Security Info */}
            <section id="about" className="mt-24 px-6 max-w-4xl mx-auto text-center">
                <h2 className="text-xl sm:text-2xl font-semibold text-start ">FAQs</h2>
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1" className="rounded-xl py-4 px-4 sm:px-20 my-3 shadow-sm shadow-purple-900 hover:shadow-lg">
                        <AccordionTrigger className="text-lg text-purple-300 ">Why do I even need a password manager?</AccordionTrigger>
                        <AccordionContent className="text-start text-muted-foreground text-lg">
                            Most people reuse weak passwords or store them insecurely. A password manager lets you store strong, unique passwords for every site, so you never have to remember them all or risk a data breach.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="rounded-xl py-4 px-4 sm:px-20 text-lg my-3 shadow-sm shadow-purple-900 hover:shadow-lg">
                        <AccordionTrigger className="text-lg text-purple-300 ">What&apos;s wrong with using the same password everywhere?</AccordionTrigger>
                        <AccordionContent className="text-start text-muted-foreground text-lg">
                            If one site gets hacked and your password leaks, attackers can access your other accounts too. Reusing passwords = all accounts at risk.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3" className="rounded-xl py-4 px-4 sm:px-20 text-lg my-3 shadow-sm shadow-purple-900 hover:shadow-lg">
                        <AccordionTrigger className="text-lg text-purple-300 ">How is Keypr better than just writing passwords down or using Notes?</AccordionTrigger>
                        <AccordionContent className="text-start text-muted-foreground text-lg">
                            Notes apps and written passwords are not secure. Keypr encrypts all your data and only unlocks it with your personal security PIN. Your secrets stay secret.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4" className="rounded-xl py-4 px-4 sm:px-20 text-lg my-3 shadow-sm shadow-purple-900 hover:shadow-lg">
                        <AccordionTrigger className="text-lg text-purple-300 ">What kind of data can I store in Keypr?</AccordionTrigger>
                        <AccordionContent className="text-start text-muted-foreground text-lg">
                            Keypr securely stores your:
                            <ul className="ml-4">
                                <li>✔️Site/app login credentials</li>
                                <li>✔️Credit/debit card details</li>
                                <li>✔️Crypto wallet seed phrases</li>
                            </ul>

                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5" className="rounded-xl py-4 px-4 sm:px-20 text-lg my-3 shadow-sm shadow-purple-900 hover:shadow-lg duration-200">
                        <AccordionTrigger className="text-lg text-purple-300">How does Keypr keep my data safe?</AccordionTrigger>
                        <AccordionContent className="text-start text-muted-foreground text-lg">
                            Everything you store is AES-encrypted before it reaches our database. Only you can decrypt it with your personal PIN. Even we can’t see your data.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>

        </main>
    );
}


function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <motion.div
            className="rounded-2xl border border-border py-10 p-8 text-center shadow-sm hover:shadow-md transition-all bg-purple-700/10 hover:shadow-lg hover:shadow-purple-500"
            whileHover={{ scale: 1.03 }}
        >
            <div className="text-purple-600 dark:text-purple-400 mb-3">{icon}</div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-sm sm:text-lg text-muted-foreground leading-8">{description}</p>
        </motion.div>
    );
}

