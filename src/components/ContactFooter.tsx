import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Phone, Mail, Instagram, MapPin } from "lucide-react";

const ContactFooter = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <footer id="contact" className="py-20 px-6 md:px-12 bg-background border-t border-border">
      <div ref={ref} className="container max-w-6xl mx-auto">
        <div className={`grid md:grid-cols-3 gap-12 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <div>
            <h3 className="font-serif text-2xl font-bold text-gold mb-4">Creative Photography</h3>
            <p className="font-sans text-sm text-foreground/50 leading-relaxed">
              Capturing your most precious moments with artistry and passion. Every frame, a memory preserved forever.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-6">Get In Touch</h4>
            <div className="space-y-4">
              <a href="tel:+919876543210" className="flex items-center gap-3 text-foreground/60 hover:text-gold transition-colors font-sans text-sm">
                <Phone className="w-4 h-4 text-gold" /> +91 98765 43210
              </a>
              <a href="mailto:hello@creativephotography.in" className="flex items-center gap-3 text-foreground/60 hover:text-gold transition-colors font-sans text-sm">
                <Mail className="w-4 h-4 text-gold" /> hello@creativephotography.in
              </a>
              <a href="https://instagram.com/creativephotography" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground/60 hover:text-gold transition-colors font-sans text-sm">
                <Instagram className="w-4 h-4 text-gold" /> @creativephotography
              </a>
              <div className="flex items-center gap-3 text-foreground/60 font-sans text-sm">
                <MapPin className="w-4 h-4 text-gold" /> Based in India
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-6">Quick Links</h4>
            <div className="space-y-3">
              <a href="#about" className="block text-foreground/60 hover:text-gold transition-colors font-sans text-sm">About</a>
              <a href="#portfolio" className="block text-foreground/60 hover:text-gold transition-colors font-sans text-sm">Portfolio</a>
              <a href="#services" className="block text-foreground/60 hover:text-gold transition-colors font-sans text-sm">Services</a>
              <a href="#book" className="block text-foreground/60 hover:text-gold transition-colors font-sans text-sm">Book a Session</a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border text-center">
          <p className="font-sans text-xs text-foreground/30">
            © {new Date().getFullYear()} Creative Photography. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ContactFooter;
