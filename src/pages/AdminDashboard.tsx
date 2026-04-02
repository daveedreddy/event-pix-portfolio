import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, LogOut, Image, Calendar, Eye } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;
type Booking = Tables<"bookings">;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"projects" | "bookings">("projects");
  const [showAdd, setShowAdd] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "", image_url: "", category: "Wedding", event_date: "" });

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/admin-login"); return; }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle();
      if (!data) { navigate("/admin-login"); return; }
    };
    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate("/admin-login");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addProject = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("projects").insert({
        title: newProject.title.trim(),
        description: newProject.description.trim() || null,
        image_url: newProject.image_url.trim() || null,
        category: newProject.category,
        event_date: newProject.event_date || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      toast({ title: "Project added! 🎉" });
      setShowAdd(false);
      setNewProject({ title: "", description: "", image_url: "", category: "Wedding", event_date: "" });
    },
    onError: () => toast({ title: "Failed to add project", variant: "destructive" }),
  });

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      toast({ title: "Project deleted" });
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  const categories = ["Wedding", "Birthday", "Corporate", "Baby Shower", "Graduation", "Festival", "Other"];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gold">Admin Dashboard</h1>
          <p className="font-sans text-xs text-foreground/40">Creative Photography</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" className="text-foreground/40 hover:text-gold transition-colors">
            <Eye className="w-5 h-5" />
          </a>
          <Button onClick={handleLogout} variant="ghost" size="sm" className="text-foreground/50 hover:text-foreground">
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setTab("projects")}
            className={`font-sans text-sm px-4 py-2 rounded-full transition-colors ${tab === "projects" ? "gradient-gold text-primary-foreground" : "bg-secondary text-foreground/60 hover:text-foreground"}`}
          >
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setTab("bookings")}
            className={`font-sans text-sm px-4 py-2 rounded-full transition-colors ${tab === "bookings" ? "gradient-gold text-primary-foreground" : "bg-secondary text-foreground/60 hover:text-foreground"}`}
          >
            Bookings ({bookings.length})
          </button>
        </div>

        {tab === "projects" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-foreground">Manage Projects</h2>
              <Button onClick={() => setShowAdd(!showAdd)} className="gradient-gold text-primary-foreground">
                <Plus className="w-4 h-4 mr-1" /> Add Project
              </Button>
            </div>

            {showAdd && (
              <div className="bg-card border border-border rounded-lg p-6 mb-6 space-y-4">
                <Input value={newProject.title} onChange={(e) => setNewProject((p) => ({ ...p, title: e.target.value }))} placeholder="Project Title *" className="bg-secondary border-border" maxLength={200} />
                <Textarea value={newProject.description} onChange={(e) => setNewProject((p) => ({ ...p, description: e.target.value }))} placeholder="Description" className="bg-secondary border-border resize-none" maxLength={500} />
                <div className="grid sm:grid-cols-3 gap-4">
                  <Input value={newProject.image_url} onChange={(e) => setNewProject((p) => ({ ...p, image_url: e.target.value }))} placeholder="Image URL" className="bg-secondary border-border" />
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject((p) => ({ ...p, category: e.target.value }))}
                    className="flex h-10 rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                  >
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <Input type="date" value={newProject.event_date} onChange={(e) => setNewProject((p) => ({ ...p, event_date: e.target.value }))} className="bg-secondary border-border" />
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => addProject.mutate()} disabled={!newProject.title.trim() || addProject.isPending} className="gradient-gold text-primary-foreground">
                    {addProject.isPending ? "Adding..." : "Save Project"}
                  </Button>
                  <Button onClick={() => setShowAdd(false)} variant="ghost" className="text-foreground/50">Cancel</Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg">
                  {project.image_url ? (
                    <img src={project.image_url} alt={project.title} className="w-16 h-12 rounded object-cover" />
                  ) : (
                    <div className="w-16 h-12 rounded bg-secondary flex items-center justify-center">
                      <Image className="w-5 h-5 text-foreground/20" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-sans font-medium text-foreground truncate">{project.title}</h3>
                    <p className="font-sans text-xs text-foreground/40">{project.category} {project.event_date && `• ${project.event_date}`}</p>
                  </div>
                  <Button onClick={() => deleteProject.mutate(project.id)} variant="ghost" size="icon" className="text-destructive hover:text-destructive/80">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-center text-foreground/30 font-sans py-12">No projects yet. Add your first one!</p>
              )}
            </div>
          </div>
        )}

        {tab === "bookings" && (
          <div>
            <h2 className="font-serif text-xl text-foreground mb-6">Booking Inquiries</h2>
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-5 bg-card border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-sans font-medium text-foreground">{booking.visitor_name}</h3>
                      <p className="font-sans text-xs text-foreground/40">{booking.visitor_email} {booking.visitor_phone && `• ${booking.visitor_phone}`}</p>
                    </div>
                    <span className={`font-sans text-xs px-3 py-1 rounded-full ${booking.status === "pending" ? "bg-accent text-accent-foreground" : "gradient-gold text-primary-foreground"}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-2 text-sm font-sans text-foreground/60">
                    <div><span className="text-gold">Event:</span> {booking.event_type}</div>
                    {booking.requested_date && <div className="flex items-center gap-1"><Calendar className="w-3 h-3 text-gold" /> {booking.requested_date}</div>}
                    {booking.budget && <div><span className="text-gold">Budget:</span> {booking.budget}</div>}
                  </div>
                  {booking.description && <p className="mt-3 font-sans text-sm text-foreground/50 border-t border-border pt-3">{booking.description}</p>}
                </div>
              ))}
              {bookings.length === 0 && (
                <p className="text-center text-foreground/30 font-sans py-12">No booking inquiries yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
