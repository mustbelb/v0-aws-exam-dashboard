import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AWS Exam Prep - Master Your Certification",
  description: "Practice AWS certification exam questions with AI-powered feedback and detailed explanations",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" >
      <body className={inter.className}>
        {process.env.APP_ENVIRONMENT === 'staging' && (
          <div className="bg-amber-100 px-4 py-2 text-center text-sm font-medium text-amber-950">
            Cert Galaxy staging · Synthetic test data only
          </div>
        )}
        {children}
      </body>
    </html>
  )
}
