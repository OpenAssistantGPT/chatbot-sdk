import { Features } from '@/components/features';
import { Hero } from '@/components/hero';
import { TechCarousel } from '@/components/tech-carousel';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <Hero />
      <Features />
      <TechCarousel />
    </main>
  );
}
