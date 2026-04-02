import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

const eventTypes = ["Wedding", "Birthday Party", "Corporate Event", "Baby Shower", "Graduation", "Festival", "Other"];

const BookingSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    visitor_name: "",
    visitor_email: "",
    visitor_phone: "",
    event_type: "",
    requested_date: "",
    budget: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.visitor_name.trim() || !form.visitor_email.trim() || !form.event_type) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("bookings").insert({
      visitor_name: form.visitor_name.trim(),
      visitor_email: form.visitor_email.trim(),
      visitor_phone: form.visitor_phone.trim() || null,
      event_type: form.event_type,
      requested_date: form.requested_date || null,
      budget: form.budget.trim() || null,
      description: form.description.trim() || null,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" });
    } else {
      toast({ title: "Booking Request Sent! ✨", description: "We'll get back to you soon." });
      setForm({ visitor_name: "", visitor_email: "", visitor_phone: "", event_type: "", requested_date: "", budget: "", description: "" });
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <section id="book" className="py-24 px-6 md:px-12 bg-card">
      <div ref={ref} className="container max-w-3xl mx-auto">
        <div className={`text-center mb-12 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-gold mb-4">Let's Work Together</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Book Your <span className="text-gradient-gold">Session</span>
          </h2>
          <p className="font-sans text-foreground/50 mt-4">
            Tell us about your event and we'll craft the perfect package for you
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`space-y-5 ${isVisible ? "animate-fade-up stagger-2" : "opacity-0"}`}
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="font-sans text-xs text-foreground/50 uppercase tracking-wider mb-1 block">Name *</label>
              <Input value={form.visitor_name} onChange={update("visitor_name")} placeholder="Your full name" maxLength={100} className="bg-secondary border-border focus:border-gold" />
            </div>
            <div>
              <label className="font-sans text-xs text-foreground/50 uppercase tracking-wider mb-1 block">Email *</label>
              <Input type="email" value={form.visitor_email} onChange={update("visitor_email")} placeholder="your@email.com" maxLength={255} className="bg-secondary border-border focus:border-gold" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="font-sans text-xs text-foreground/50 uppercase tracking-wider mb-1 block">Phone</label>
              <Input value={form.visitor_phone} onChange={update("visitor_phone")} placeholder="+91 98765 43210" maxLength={20} className="bg-secondary border-border focus:border-gold" />
            </div>
            <div>
              <label className="font-sans text-xs text-foreground/50 uppercase tracking-wider mb-1 block">Event Type *</label>
              <select
                value={form.event_type}
                onChange={update("event_type")}
                className="flex h-10 w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">Select event type</option>
                {eventTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="font-sans text-xs text-foreground/50 uppercase tracking-wider mb-1 block">Preferred Date</label>
              <Input type="date" value={form.requested_date} onChange={update("requested_date")} className="bg-secondary border-border focus:border-gold" />
            </div>
            <div>
              <label className="font-sans text-xs text-foreground/50 uppercase tracking-wider mb-1 block">Budget Range</label>
              <Input value={form.budget} onChange={update("budget")} placeholder="e.g., ₹20,000 - ₹50,000" maxLength={50} className="bg-secondary border-border focus:border-gold" />
            </div>
          </div>

          <div>
            <label className="font-sans text-xs text-foreground/50 uppercase tracking-wider mb-1 block">Tell Us About Your Event</label>
            <Textarea
              value={form.description}
              onChange={update("description")}
              placeholder="Describe your event, any special requirements, number of guests, location, etc."
              rows={4}
              maxLength={1000}
              className="bg-secondary border-border focus:border-gold resize-none"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full gradient-gold text-primary-foreground font-sans font-semibold tracking-wider uppercase hover:opacity-90 h-12">
            {loading ? "Sending..." : (
              <>
                <Send className="w-4 h-4 mr-2" /> Send Booking Request
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default BookingSection;
