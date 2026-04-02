import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Heart, Cake, Building, PartyPopper, GraduationCap, Baby } from "lucide-react";

const services = [
  { icon: Heart, title: "Wedding Photography", desc: "Complete wedding coverage from pre-wedding to reception" },
  { icon: Cake, title: "Birthday Parties", desc: "Capturing joy and celebrations of every milestone" },
  { icon: Building, title: "Corporate Events", desc: "Professional coverage for conferences and galas" },
  { icon: PartyPopper, title: "Festive Functions", desc: "Cultural celebrations and festival photography" },
  { icon: GraduationCap, title: "Graduation Events", desc: "Marking academic achievements beautifully" },
  { icon: Baby, title: "Baby Showers", desc: "Tender moments of new beginnings" },
];

const ServicesSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="services" className="py-24 px-6 md:px-12 bg-background">
      <div ref={ref} className="container max-w-6xl mx-auto">
        <div className={`text-center mb-16 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-gold mb-4">What We Offer</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Our <span className="text-gradient-gold">Services</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`p-8 rounded-lg bg-card border border-border hover-lift group transition-colors hover:border-gold/30 ${
                isVisible ? `animate-fade-up stagger-${index + 1}` : "opacity-0"
              }`}
            >
              <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <service.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{service.title}</h3>
              <p className="font-sans text-sm text-foreground/50 leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
