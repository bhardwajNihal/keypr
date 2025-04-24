"use client"
import { motion } from "framer-motion"
import { HeroHighlight } from "./ui/hero-highlight";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/app/components/ui/accordion"
import { ContainerTextFlip } from "./ui/container-text-flip";
import { SignUpButton } from "@clerk/nextjs";
import { SignedOut } from "@clerk/clerk-react";
import { CreditCard, KeyRound, Lock, ShieldCheck } from "lucide-react";

export default function LandingPage() {

    const features = [
        {
          icon: <Lock className="h-6 w-6 text-white" />,
          title: "Store Passwords",
          description:
            "Save and manage credentials for websites and apps. Now set strong passwords with worry of remembering them.",
        },
        {
          icon: <CreditCard className="h-6 w-6 text-white" />,
          title: "Secure Card Storage",
          description:
            "Safely store your credit/debit card details with encryption and masked previews.",
        },
        {
          icon: <KeyRound className="h-6 w-6 text-white" />,
          title: "Seed Phrase Protection",
          description:
            "Ever heard that you are screwed if you ever lose the seed phrase of your crypto wallet. Not anymore, store is here securely, encrypted and only accessed by you via pin.",
        },
        {
          icon: <ShieldCheck className="h-6 w-6 text-white" />,
          title: "Server Side Encryption",
          description:
            "All sensitive data is encrypted before being stored to Database. Securely locked via pin, making sure its only you who can access.",
        },
      ];

    return (
        <main className="bg-background text-foreground ">
            {/* Hero Section */}

            <HeroHighlight>
                <section id="home" className="min-h-screen flex flex-col justify-center items-center text-center gap-6 max-w-3xl mx-auto">
                    <motion.h1
                        className="text-4xl md:text-6xl font-extrabold text-purple-400 dark:text-purple-400 px-8 md:px-12"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        Safegaurd Your Digital Presence with <span className="text-purple-600 dark:text-purple-600">Keypr</span>
                    </motion.h1>
                    <p className="text-lg sm:text-2xl text-muted-foreground px-6 md:px-16">Because sticky notes aren&apos;t secure, and memory isn&apos;t forever.</p>

                    <div className=" w-full flex sm:flex-row gap-4 flex-col justify-center items-center text-center">
                        <div className="text-foreground ">
                            <span className="text-lg sm:text-xl font-semibold">Store your</span><ContainerTextFlip words={["site/app credentials", "debit card details", "credit card details", "crypto secret phrase"]} /><span className="text-lg sm:text-xl font-semibold"></span>
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
            </HeroHighlight>

            {/* Features Section */}
            <section id="features" className="flex justify-center flex-col items-center mt-20">
                <h2 className="text-lg sm:text-2xl font-semibold my-6">Features</h2>
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-2 mx-auto px-auto">
                {features.map(({ icon, title, description }, i) => (
                    <div
                        key={i}
                        className="group relative flex w-full max-w-sm flex-col items-start gap-4 rounded-2xl bg-gradient-to-br from-purple-900 via-purple-600 to-purple-950 p-6 text-white shadow-xl transition hover:scale-[1.02] hover:shadow-2xl"
                    >
                        <div className="absolute inset-0 z-0 rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10"></div>

                        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
                            {icon}
                        </div>

                        <h3 className="relative z-10 text-xl font-bold tracking-tight text-white">
                            {title}
                        </h3>

                        <p className="relative z-10 text-sm text-white/90">{description}</p>

                        <div className="absolute inset-0 z-0 rounded-2xl border border-transparent transition group-hover:border-purple-600/40 group-hover:shadow-[0_0_20px_4px_rgba(192,132,252,0.3)]"></div>
                    </div>
                ))}
            </div>
            </section>

            {/* Security Info */}
            <section id="about" className="mt-24 px-6 max-w-4xl mx-auto text-center">
                <h2 className="text-xl sm:text-2xl font-semibold ">FAQs</h2>
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1" className="rounded-xl py-4 px-4 sm:px-20 my-3 shadow-sm shadow-purple-900 hover:shadow-lg">
                        <AccordionTrigger className="text-lg text-purple-500 dark:text-purple-400">Why do I even need a password manager?</AccordionTrigger>
                        <AccordionContent className="text-start text-muted-foreground text-lg">
                            Most people reuse weak passwords or store them insecurely. A password manager lets you store strong, unique passwords for every site, so you never have to remember them all or risk a data breach.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="rounded-xl py-4 px-4 sm:px-20 text-lg my-3 shadow-sm shadow-purple-900 hover:shadow-lg">
                        <AccordionTrigger className="text-lg text-purple-500 dark:text-purple-400">What&apos;s wrong with using the same password everywhere?</AccordionTrigger>
                        <AccordionContent className="text-start text-muted-foreground text-lg">
                            If one site gets hacked and your password leaks, attackers can access your other accounts too. Reusing passwords = all accounts at risk.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3" className="rounded-xl py-4 px-4 sm:px-20 text-lg my-3 shadow-sm shadow-purple-900 hover:shadow-lg">
                        <AccordionTrigger className="text-lg text-purple-500 dark:text-purple-400">How is Keypr better than just writing passwords down or using Notes?</AccordionTrigger>
                        <AccordionContent className="text-start text-muted-foreground text-lg">
                            Notes apps and written passwords are not secure. Keypr encrypts all your data and only unlocks it with your personal security PIN. Your secrets stay secret.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4" className="rounded-xl py-4 px-4 sm:px-20 text-lg my-3 shadow-sm shadow-purple-900 hover:shadow-lg">
                        <AccordionTrigger className="text-lg text-purple-500 dark:text-purple-400">What kind of data can I store in Keypr?</AccordionTrigger>
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
                        <AccordionTrigger className="text-lg text-purple-500 dark:text-purple-400">How does Keypr keep my data safe?</AccordionTrigger>
                        <AccordionContent className="text-start text-muted-foreground text-lg">
                            Everything you store is AES-encrypted before it reaches our database. Only you can decrypt it with your personal PIN. Even we can’t see your data.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>

        </main>
    );
}

