import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import PortfolioSection from "@/components/PortfolioSection";
import ServicesSection from "@/components/ServicesSection";
import BookingSection from "@/components/BookingSection";
import ContactFooter from "@/components/ContactFooter";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <AboutSection />
      <PortfolioSection />
      <ServicesSection />
      <BookingSection />
      <ContactFooter />
    </main>
  );
};

export default Index;
