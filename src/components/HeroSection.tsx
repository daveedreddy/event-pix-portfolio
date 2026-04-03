import heroImage from "@/assets/hero-wedding.jpg";
import logoPlaceholder from "@/assets/logo-placeholder.png";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const HeroSection = () => {
  const { data: settings } = useSiteSettings();
  const logoUrl = settings?.logo_url || "";
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#portfolio", label: "Portfolio" },
    { href: "#services", label: "Services" },
    { href: "#book", label: "Book Now" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Wedding photography by Creative Photography"
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="gradient-dark-overlay absolute inset-0" />
      </div>

      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-10 w-10 rounded-full object-cover" width={40} height={40} />
          ) : (
            <img src={logoPlaceholder} alt="CP Logo" className="h-10 w-10 object-contain" width={40} height={40} />
          )}
          <h2 className="font-serif text-xl md:text-2xl text-gold tracking-wider">
            Creative Photography
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm tracking-widest uppercase font-sans">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-foreground/70 hover:text-gold transition-colors duration-300 story-link">
              {link.label}
            </a>
          ))}
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground/70 hover:text-gold transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="absolute top-20 left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-6 py-6 md:hidden animate-fade-in">
          <div className="flex flex-col gap-4 text-sm tracking-widest uppercase font-sans">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-foreground/70 hover:text-gold transition-colors duration-300 py-2"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
        <p className="animate-fade-up stagger-1 mb-4 font-sans text-sm md:text-base tracking-[0.3em] uppercase text-gold">
          Capturing Moments That Last Forever
        </p>
        <h1 className="animate-fade-up stagger-2 font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
          <span className="text-foreground">Creative</span>
          <br />
          <span className="text-gradient-gold">Photography</span>
        </h1>
        <p className="animate-fade-up stagger-3 max-w-lg font-sans text-base md:text-lg text-foreground/60 mb-8">
          From intimate birthdays to grand weddings — we tell your story through stunning visuals
        </p>
        <a
          href="#book"
          className="animate-fade-up stagger-4 inline-block gradient-gold px-8 py-3 rounded-full font-sans text-sm font-semibold tracking-wider uppercase text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Book Your Session
        </a>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-gold/40 flex items-start justify-center pt-2">
          <div className="w-1 h-3 rounded-full bg-gold animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
