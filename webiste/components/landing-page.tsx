'use client';

import React from 'react';
import { SiteFooter } from '@/components/site-footer';
import { useEffect, useState } from 'react';
import { MainNav } from '@/components/main-nav';
import { marketingConfig } from '@/config/marketing';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export function LandingPage({ children }: { children: React.ReactNode }) {
  const [isHeaderTransparent, setIsHeaderTransparent] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsHeaderTransparent(scrollTop === 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <body className={inter.className} >
      <header
        className={`z-40 ${
          isHeaderTransparent
            ? 'bg-transparent'
            : 'bg-white/75 backdrop-blur-lg border-b'
        } sticky inset-x-0 top-0 w-full transition-all duration-1000`}
      >
        <div className="container flex h-20 items-center justify-between py-6 mx-5 ">
          <MainNav items={marketingConfig.mainNav} />
          <nav></nav>
        </div>
      </header>
      {children}

      <SiteFooter />
    </body>
  );
}
