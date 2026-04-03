import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { X, Check, ChevronRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Service = Tables<"services">;
type ServicePackage = Tables<"service_packages">;

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  const Icon = icons[name] || LucideIcons.Camera;
  return <Icon className={className} />;
};

const ServicesSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: packages = [] } = useQuery({
    queryKey: ["service-packages", selectedService?.id],
    queryFn: async () => {
      if (!selectedService) return [];
      const { data, error } = await supabase
        .from("service_packages")
        .select("*")
        .eq("service_id", selectedService.id)
        .order("display_order");
      if (error) throw error;
      return data;
    },
    enabled: !!selectedService,
  });

  const { data: relatedProjects = [] } = useQuery({
    queryKey: ["service-projects", selectedService?.id],
    queryFn: async () => {
      if (!selectedService) return [];
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("service_id", selectedService.id)
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedService,
  });

  return (
    <>
      <section id="services" className="py-24 px-6 md:px-12 bg-background">
        <div ref={ref} className="container max-w-6xl mx-auto">
          <div className={`text-center mb-16 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
            <p className="font-sans text-sm tracking-[0.3em] uppercase text-gold mb-4">What We Offer</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              Our <span className="text-gradient-gold">Services</span>
            </h2>
            <p className="font-sans text-foreground/50 mt-4 max-w-md mx-auto">
              Click on any service to see packages and past work
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={`text-left p-8 rounded-lg bg-card border border-border hover-lift group transition-all hover:border-gold/30 ${
                  isVisible ? `animate-fade-up stagger-${index + 1}` : "opacity-0"
                }`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                    <DynamicIcon name={service.icon} className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="font-sans text-sm text-foreground/50 leading-relaxed">{service.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedService(null)}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <div
            className="relative bg-card border border-border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
                  <DynamicIcon name={selectedService.icon} className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-foreground">{selectedService.title}</h3>
                  <p className="font-sans text-xs text-foreground/50">{selectedService.description}</p>
                </div>
              </div>
              <button onClick={() => setSelectedService(null)} className="text-foreground/40 hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Packages */}
              {packages.length > 0 && (
                <div className="mb-8">
                  <h4 className="font-serif text-lg font-bold text-gold mb-4">Packages</h4>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {packages.map((pkg, i) => (
                      <div
                        key={pkg.id}
                        className={`p-5 rounded-lg border transition-all hover-lift ${
                          i === 1
                            ? "border-gold/50 bg-accent/30"
                            : "border-border bg-secondary/30"
                        }`}
                      >
                        {i === 1 && (
                          <span className="font-sans text-[10px] tracking-wider uppercase text-gold font-semibold mb-2 block">
                            Popular
                          </span>
                        )}
                        <h5 className="font-serif text-lg font-bold text-foreground mb-1">{pkg.name}</h5>
                        <p className="font-serif text-2xl font-bold text-gold mb-4">{pkg.price}</p>
                        <ul className="space-y-2">
                          {pkg.features.map((feature, fi) => (
                            <li key={fi} className="flex items-start gap-2 font-sans text-sm text-foreground/60">
                              <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {packages.length === 0 && (
                <div className="mb-8 p-8 rounded-lg border border-border text-center">
                  <p className="font-sans text-foreground/40">
                    Packages coming soon! Contact us for custom pricing.
                  </p>
                </div>
              )}

              {/* Related Projects */}
              {relatedProjects.length > 0 && (
                <div>
                  <h4 className="font-serif text-lg font-bold text-gold mb-4">Past Work</h4>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {relatedProjects.map((project) => (
                      <div key={project.id} className="group relative overflow-hidden rounded-lg">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={project.image_url || "/placeholder.svg"}
                            alt={project.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent flex items-end p-3">
                          <div>
                            <p className="font-serif text-sm font-bold text-foreground">{project.title}</p>
                            {project.description && (
                              <p className="font-sans text-xs text-foreground/50">{project.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesSection;
