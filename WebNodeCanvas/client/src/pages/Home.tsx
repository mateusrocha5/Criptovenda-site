import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import HeroSection from "@/components/home/HeroSection";
import TokensSection from "@/components/home/TokensSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import KYCSection from "@/components/home/KYCSection";
import ContactSection from "@/components/home/ContactSection";
import NewsSection from "@/components/news/NewsSection";
import WhatsAppChat from "@/components/support/WhatsAppChat";
import { useScrollToAnchor } from "@/hooks/useScrollToAnchor";
import { useEffect } from "react";
import CreateTokenSection from '@/components/home/CreateTokenSection';

const Home = () => {
  const { scrollToAnchor } = useScrollToAnchor();

  // Apply smooth scrolling behavior
  useEffect(() => {
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('#')) {
          const id = href.substring(1);
          scrollToAnchor(id);
        }
      });
    });

    return () => {
      anchors.forEach(anchor => {
        anchor.removeEventListener('click', () => {});
      });
    };
  }, [scrollToAnchor]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <TokensSection />
        <CreateTokenSection />
        <FeaturesSection />
        <NewsSection />
        <KYCSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppChat />
    </div>
  );
};

export default Home;