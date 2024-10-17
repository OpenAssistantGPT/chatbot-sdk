import './globals.css';
import { LandingPage } from '@/components/landing-page';
import { constructMetadata } from '@/lib/metadata';
import { Analytics } from '@vercel/analytics/react';

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: any;
}>) {
  return (
    <html lang="en">
      <Analytics />
      <LandingPage>{children}</LandingPage>
    </html>
  );
}
