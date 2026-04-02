import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import portfolioBirthday from "@/assets/portfolio-birthday.jpg";
import portfolioWedding from "@/assets/portfolio-wedding.jpg";
import portfolioCorporate from "@/assets/portfolio-corporate.jpg";

const fallbackProjects = [
  { id: "1", title: "Royal Wedding Ceremony", category: "Wedding", image_url: portfolioWedding, description: "A grand celebration of love" },
  { id: "2", title: "Little Star's Birthday", category: "Birthday", image_url: portfolioBirthday, description: "Magical moments of joy" },
  { id: "3", title: "Corporate Gala Night", category: "Corporate", image_url: portfolioCorporate, description: "Elegance meets professionalism" },
];

const PortfolioSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const displayProjects = projects && projects.length > 0 ? projects : fallbackProjects;

  return (
    <section id="portfolio" className="py-24 px-6 md:px-12 bg-card">
      <div ref={ref} className="container max-w-6xl mx-auto">
        <div className={`text-center mb-16 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-gold mb-4">Our Work</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Featured <span className="text-gradient-gold">Projects</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProjects.map((project, index) => (
            <div
              key={project.id}
              className={`group relative overflow-hidden rounded-lg hover-lift cursor-pointer ${
                isVisible ? `animate-scale-in stagger-${index + 1}` : "opacity-0"
              }`}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.image_url || portfolioWedding}
                  alt={project.title}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <span className="font-sans text-xs tracking-[0.2em] uppercase text-gold mb-1">
                  {project.category}
                </span>
                <h3 className="font-serif text-xl font-bold text-foreground">{project.title}</h3>
                {project.description && (
                  <p className="font-sans text-sm text-foreground/60 mt-1">{project.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
