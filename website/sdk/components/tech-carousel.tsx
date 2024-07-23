'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

export function TechCarousel() {
  return (
    <section className="w-full py-6 md:py-12 lg:py-24 xl:py-24">
      <div className="container px-4 md:px-6 flex flex-col items-center justify-center text-center">
        <h3 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl mb-8">
          Built using the latest technologies
        </h3>
        <Carousel
          className="w-full max-w-[65%]"
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
        >
          <CarouselContent className="-ml-1">
            <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <Image
                      src="/vercel.svg"
                      alt="React"
                      width={128}
                      height={128}
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
            <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <Image
                      src="/next.svg"
                      alt="React"
                      width={128}
                      height={128}
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
            <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <Image
                      src="/tailwindcss.png"
                      alt="React"
                      width={128}
                      height={128}
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
            <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <Image
                      src="/shadcn.png"
                      alt="React"
                      width={128}
                      height={128}
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
            <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <Image
                      src="/turbo.png"
                      alt="React"
                      width={128}
                      height={128}
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
