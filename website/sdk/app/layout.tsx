import type { Metadata } from 'next';
import './globals.css';
import { LandingPage } from '@/components/landing-page';

export const metadata: Metadata = {
  title: 'OpenAssistantGPT SDK',
  description:
    'SDK created by the OpenAssistantGPT team to help you build smart chatbots using OpenAI Assistant API.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <LandingPage>{children}</LandingPage>
    </html>
  );
}
