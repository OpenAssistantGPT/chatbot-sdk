import './globals.css';
import { LandingPage } from '@/components/landing-page';
import { constructMetadata } from '@/lib/metadata';

export const metadata = constructMetadata();

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
