import '@openassistantgpt/ui/dist/index.css';

import { Inter } from 'next/font/google';
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'OpenAssistantGPT SDK Example',
  description: 'Example of using OpenAssistantGPT SDK in a Next.js website',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Analytics/> 
      <body className={inter.className}>{children}</body>
    </html>
  );
}
