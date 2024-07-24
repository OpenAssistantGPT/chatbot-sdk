import { siteConfig } from '@/config/site';
import Image from 'next/image';
import Link from 'next/link';
import { Icons } from './icons';

export function Hero() {
  return (
    <section className="w-full py-6 md:py-12 lg:py-24 xl:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-6">
              <Link
                href={siteConfig.links.twitter}
                className="rounded-2xl border shadow-md bg-muted px-4 py-1.5 text-sm font-medium"
                target="_blank"
              >
                Find us on 𝕏
              </Link>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Easiest Chatbot SDK to use
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Fastest and easiest way to build a chatbot using Next.JS for
                your website using the OpenAI Assistant API.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                href="https://github.com/OpenAssistantGPT/chatbot-sdk"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                <Icons.gitHub className="h-4 w-4 mr-2"></Icons.gitHub> GitHub
              </Link>

              <Link
                href="https://github.com/OpenAssistantGPT/chatbot-sdk?tab=readme-ov-file#openassistantgpt-sdk"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              src="/hero.png"
              alt="Hero Image"
              width={1200}
              height={1200}
            ></Image>
          </div>
        </div>
      </div>
    </section>
  );
}
