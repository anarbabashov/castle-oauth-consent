import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Castle OAuth Authorization',
	description: 'Authorize third-party applications to access your Castle account',
	icons: {
		icon: '/favicon.ico',
		shortcut: '/favicon.ico',
		apple: '/favicon.ico',
	},
}

export default function RootLayout({
  children,
}: {
	children: React.ReactNode
}) {
  return (
    <html lang="en">
			<body className={inter.className}>{children}</body>
    </html>
	)
}
