import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { HowItWorks } from '@/components/home/HowItWorks';
import { ForAthletes } from '@/components/home/ForAthletes';
import { ForClubs } from '@/components/home/ForClubs';
import { FAQ } from '@/components/home/FAQ';
import { CTASection } from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <HowItWorks />
        <ForAthletes />
        <ForClubs />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
