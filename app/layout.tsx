import { type Metadata } from 'next'
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from './navbar/nav'
import { ThemeProvider } from './components/theme-provider'
import Footer from './footer/footer'
import {Toaster} from "react-hot-toast"
import { RecoilRoot } from "recoil";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Keypr',
  description: 'Your own password manager',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <RecoilRoot>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <Navbar />
          <Toaster/>
          {children}
          <Footer/>
          </ThemeProvider>
          </RecoilRoot>
        </body>
      </html>
    </ClerkProvider>
  )
}