'use client';

import React from 'react';
import { SiteFooter } from '@/components/site-footer';
import { useEffect, useState } from 'react';
import { MainNav } from '@/components/main-nav';
import { marketingConfig } from '@/config/marketing';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';

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
    <body className={inter.className}>
      <header
        className={`z-40 ${
          isHeaderTransparent
            ? 'bg-transparent'
            : 'bg-white/75 backdrop-blur-lg border-b'
        } sticky inset-x-0 top-0 w-full transition-all duration-1000`}
      >
        <div className="container flex h-20 items-center justify-between px-12 py-6 ">
          <MainNav items={marketingConfig.mainNav} />
          <nav className="flex flex-row space-x-4 ml-4">
            <a
              href="https://www.producthunt.com/posts/openassistantgpt-sdk?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-openassistantgpt&#0045;sdk"
              target="_blank"
            >
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=473387&theme=light"
                alt="OpenAssistantGPT&#0032;SDK - Best&#0032;chatbot&#0032;SDK&#0032;for&#0032;the&#0032;OpenAI&#0032;Assistant | Product Hunt"
                style={{ width: '200px', height: '54px' }}
              />
            </a>
            <Link
              href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FOpenAssistantGPT%2FOpenAssistantGPT-SDK%2Ftree%2Fmain%2Fexamples%2Fnext-website&env=OPENAI_ASSISTANT_ID,OPENAI_API_KEY&envDescription=Find%20all%20informations%20in%20OpenAI%20Platform.&envLink=https%3A%2F%2Fplatform.openai.com%2F"
              className="hidden sm:flex inline-flex h-10 mt-2 pt-1 pb-1 items-center justify-center rounded-md border border-input bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                width={65}
                height={65}
                className="mr-2"
              ></Image>
              - Once Click Deploy
            </Link>
          </nav>
        </div>
      </header>
      {children}

      <SiteFooter />
    </body>
  );
}
