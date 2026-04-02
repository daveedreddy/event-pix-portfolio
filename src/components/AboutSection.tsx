import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Camera, Award, Users } from "lucide-react";

const stats = [
  { icon: Camera, value: "500+", label: "Events Captured" },
  { icon: Award, value: "8+", label: "Years Experience" },
  { icon: Users, value: "300+", label: "Happy Clients" },
];

const AboutSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="about" className="py-24 px-6 md:px-12 bg-background">
      <div ref={ref} className="container max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className={isVisible ? "animate-slide-in-left" : "opacity-0"}>
            <p className="font-sans text-sm tracking-[0.3em] uppercase text-gold mb-4">
              About The Photographer
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Every Frame Tells <br />
              <span className="text-gradient-gold">A Story</span>
            </h2>
            <p className="font-sans text-foreground/60 leading-relaxed mb-6">
              I'm the founder of Creative Photography, a passionate photographer dedicated to
              capturing life's most precious moments. With over 8 years of experience in wedding
              and event photography, I bring a unique blend of artistic vision and technical expertise
              to every shoot.
            </p>
            <p className="font-sans text-foreground/60 leading-relaxed">
              From the joyful tears at a wedding ceremony to the laughter at a birthday party,
              I believe every event deserves to be documented beautifully. My goal is to create
              timeless photographs that you'll treasure for generations.
            </p>
          </div>

          <div className={isVisible ? "animate-slide-in-right" : "opacity-0"}>
            <div className="grid grid-cols-1 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`flex items-center gap-6 p-6 rounded-lg bg-card border border-border hover-lift ${
                    isVisible ? `animate-fade-up stagger-${index + 2}` : "opacity-0"
                  }`}
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-full gradient-gold flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-serif text-3xl font-bold text-gold">{stat.value}</p>
                    <p className="font-sans text-sm text-foreground/50">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
