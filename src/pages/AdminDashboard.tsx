import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, LogOut, Image, Calendar, Eye, Settings, Layers, Package, Edit2, Save, X } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;
type Booking = Tables<"bookings">;
type Service = Tables<"services">;
type ServicePackage = Tables<"service_packages">;

type TabType = "settings" | "services" | "projects" | "bookings";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<TabType>("settings");

  // Project form
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "", image_url: "", category: "Wedding", event_date: "", service_id: "" });

  // Service form
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({ title: "", description: "", icon: "Camera", display_order: 0 });
  const [editingService, setEditingService] = useState<string | null>(null);
  const [editServiceData, setEditServiceData] = useState({ title: "", description: "", icon: "" });

  // Package form
  const [showAddPackage, setShowAddPackage] = useState<string | null>(null);
  const [newPackage, setNewPackage] = useState({ name: "", price: "", features: "", display_order: 0 });

  // Site settings
  const [editingSettings, setEditingSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState<Record<string, string>>({});

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

  // Queries
  const { data: siteSettings = [] } = useQuery({
    queryKey: ["admin-site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: servicePackages = [] } = useQuery<ServicePackage[]>({
    queryKey: ["admin-service-packages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("service_packages").select("*").order("display_order");
      if (error) throw error;
      return data;
    },
  });

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

  // Mutations
  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-site-settings"] });
    queryClient.invalidateQueries({ queryKey: ["admin-services"] });
    queryClient.invalidateQueries({ queryKey: ["admin-service-packages"] });
    queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    queryClient.invalidateQueries({ queryKey: ["services"] });
  };

  const saveSettings = useMutation({
    mutationFn: async () => {
      for (const [key, value] of Object.entries(settingsForm)) {
        const { error } = await supabase.from("site_settings").update({ value }).eq("key", key);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidateAll();
      toast({ title: "Settings saved! ✨" });
      setEditingSettings(false);
    },
    onError: () => toast({ title: "Failed to save settings", variant: "destructive" }),
  });

  const addService = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("services").insert({
        title: newService.title,
        description: newService.description,
        icon: newService.icon,
        display_order: newService.display_order,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateAll();
      toast({ title: "Service added! 🎉" });
      setShowAddService(false);
      setNewService({ title: "", description: "", icon: "Camera", display_order: 0 });
    },
    onError: () => toast({ title: "Failed to add service", variant: "destructive" }),
  });

  const updateService = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").update({
        title: editServiceData.title,
        description: editServiceData.description,
        icon: editServiceData.icon,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateAll();
      toast({ title: "Service updated!" });
      setEditingService(null);
    },
  });

  const deleteService = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateAll();
      toast({ title: "Service deleted" });
    },
  });

  const addPackage = useMutation({
    mutationFn: async (serviceId: string) => {
      const { error } = await supabase.from("service_packages").insert({
        service_id: serviceId,
        name: newPackage.name,
        price: newPackage.price,
        features: newPackage.features.split("\n").filter(Boolean),
        display_order: newPackage.display_order,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateAll();
      queryClient.invalidateQueries({ queryKey: ["admin-service-packages"] });
      toast({ title: "Package added! 📦" });
      setShowAddPackage(null);
      setNewPackage({ name: "", price: "", features: "", display_order: 0 });
    },
    onError: () => toast({ title: "Failed to add package", variant: "destructive" }),
  });

  const deletePackage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("service_packages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-service-packages"] });
      toast({ title: "Package deleted" });
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
        service_id: newProject.service_id || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      toast({ title: "Project added! 🎉" });
      setShowAddProject(false);
      setNewProject({ title: "", description: "", image_url: "", category: "Wedding", event_date: "", service_id: "" });
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

  const startEditSettings = () => {
    const form: Record<string, string> = {};
    siteSettings.forEach((s) => { form[s.key] = s.value; });
    setSettingsForm(form);
    setEditingSettings(true);
  };

  const tabs: { key: TabType; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
    { key: "services", label: "Services", icon: <Layers className="w-4 h-4" />, count: services.length },
    { key: "projects", label: "Projects", icon: <Image className="w-4 h-4" />, count: projects.length },
    { key: "bookings", label: "Bookings", icon: <Calendar className="w-4 h-4" />, count: bookings.length },
  ];

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
        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`font-sans text-sm px-4 py-2 rounded-full transition-colors flex items-center gap-2 ${
                tab === t.key ? "gradient-gold text-primary-foreground" : "bg-secondary text-foreground/60 hover:text-foreground"
              }`}
            >
              {t.icon} {t.label} {t.count !== undefined && `(${t.count})`}
            </button>
          ))}
        </div>

        {/* Settings Tab */}
        {tab === "settings" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-foreground">Site Settings</h2>
              {!editingSettings ? (
                <Button onClick={startEditSettings} className="gradient-gold text-primary-foreground">
                  <Edit2 className="w-4 h-4 mr-1" /> Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={() => saveSettings.mutate()} disabled={saveSettings.isPending} className="gradient-gold text-primary-foreground">
                    <Save className="w-4 h-4 mr-1" /> {saveSettings.isPending ? "Saving..." : "Save"}
                  </Button>
                  <Button onClick={() => setEditingSettings(false)} variant="ghost" className="text-foreground/50">
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {siteSettings.map((setting) => (
                <div key={setting.key} className="p-4 bg-card border border-border rounded-lg">
                  <label className="font-sans text-xs text-gold uppercase tracking-wider mb-2 block">
                    {setting.key.replace(/_/g, " ")}
                  </label>
                  {editingSettings ? (
                    setting.key.includes("description") ? (
                      <Textarea
                        value={settingsForm[setting.key] || ""}
                        onChange={(e) => setSettingsForm((p) => ({ ...p, [setting.key]: e.target.value }))}
                        className="bg-secondary border-border resize-none"
                        rows={3}
                      />
                    ) : (
                      <Input
                        value={settingsForm[setting.key] || ""}
                        onChange={(e) => setSettingsForm((p) => ({ ...p, [setting.key]: e.target.value }))}
                        className="bg-secondary border-border"
                        placeholder={setting.key === "logo_url" ? "Paste image URL for your logo" : ""}
                      />
                    )
                  ) : (
                    <p className="font-sans text-sm text-foreground/70">
                      {setting.value || <span className="text-foreground/30 italic">Not set</span>}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {tab === "services" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-foreground">Manage Services</h2>
              <Button onClick={() => setShowAddService(!showAddService)} className="gradient-gold text-primary-foreground">
                <Plus className="w-4 h-4 mr-1" /> Add Service
              </Button>
            </div>

            {showAddService && (
              <div className="bg-card border border-border rounded-lg p-6 mb-6 space-y-4">
                <Input value={newService.title} onChange={(e) => setNewService((p) => ({ ...p, title: e.target.value }))} placeholder="Service Title *" className="bg-secondary border-border" />
                <Textarea value={newService.description} onChange={(e) => setNewService((p) => ({ ...p, description: e.target.value }))} placeholder="Description *" className="bg-secondary border-border resize-none" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input value={newService.icon} onChange={(e) => setNewService((p) => ({ ...p, icon: e.target.value }))} placeholder="Icon name (e.g. Camera, Heart)" className="bg-secondary border-border" />
                  <Input type="number" value={newService.display_order} onChange={(e) => setNewService((p) => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} placeholder="Display Order" className="bg-secondary border-border" />
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => addService.mutate()} disabled={!newService.title.trim() || !newService.description.trim()} className="gradient-gold text-primary-foreground">
                    Save Service
                  </Button>
                  <Button onClick={() => setShowAddService(false)} variant="ghost" className="text-foreground/50">Cancel</Button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {services.map((service) => {
                const pkgs = servicePackages.filter((p) => p.service_id === service.id);
                const isEditing = editingService === service.id;

                return (
                  <div key={service.id} className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="p-4">
                      {isEditing ? (
                        <div className="space-y-3">
                          <Input value={editServiceData.title} onChange={(e) => setEditServiceData((p) => ({ ...p, title: e.target.value }))} className="bg-secondary border-border" />
                          <Textarea value={editServiceData.description} onChange={(e) => setEditServiceData((p) => ({ ...p, description: e.target.value }))} className="bg-secondary border-border resize-none" />
                          <Input value={editServiceData.icon} onChange={(e) => setEditServiceData((p) => ({ ...p, icon: e.target.value }))} placeholder="Icon" className="bg-secondary border-border" />
                          <div className="flex gap-2">
                            <Button onClick={() => updateService.mutate(service.id)} size="sm" className="gradient-gold text-primary-foreground">Save</Button>
                            <Button onClick={() => setEditingService(null)} size="sm" variant="ghost" className="text-foreground/50">Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-sans font-medium text-foreground">{service.title}</h3>
                            <p className="font-sans text-xs text-foreground/40 mt-1">{service.description}</p>
                            <p className="font-sans text-[10px] text-gold mt-1">Icon: {service.icon} • Order: {service.display_order}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => { setEditingService(service.id); setEditServiceData({ title: service.title, description: service.description, icon: service.icon }); }}
                              variant="ghost" size="icon" className="text-foreground/40 hover:text-gold"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button onClick={() => deleteService.mutate(service.id)} variant="ghost" size="icon" className="text-destructive hover:text-destructive/80">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Packages for this service */}
                    <div className="border-t border-border bg-secondary/20 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-sans text-xs text-gold uppercase tracking-wider flex items-center gap-1">
                          <Package className="w-3 h-3" /> Packages ({pkgs.length})
                        </h4>
                        <Button onClick={() => setShowAddPackage(showAddPackage === service.id ? null : service.id)} size="sm" variant="ghost" className="text-gold text-xs h-7">
                          <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                      </div>

                      {showAddPackage === service.id && (
                        <div className="bg-card border border-border rounded-lg p-4 mb-3 space-y-3">
                          <div className="grid sm:grid-cols-3 gap-3">
                            <Input value={newPackage.name} onChange={(e) => setNewPackage((p) => ({ ...p, name: e.target.value }))} placeholder="Package name (e.g. Silver)" className="bg-secondary border-border" />
                            <Input value={newPackage.price} onChange={(e) => setNewPackage((p) => ({ ...p, price: e.target.value }))} placeholder="Price (e.g. ₹25,000)" className="bg-secondary border-border" />
                            <Input type="number" value={newPackage.display_order} onChange={(e) => setNewPackage((p) => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} placeholder="Order" className="bg-secondary border-border" />
                          </div>
                          <Textarea value={newPackage.features} onChange={(e) => setNewPackage((p) => ({ ...p, features: e.target.value }))} placeholder="Features (one per line)" className="bg-secondary border-border resize-none" rows={3} />
                          <div className="flex gap-2">
                            <Button onClick={() => addPackage.mutate(service.id)} disabled={!newPackage.name || !newPackage.price} size="sm" className="gradient-gold text-primary-foreground">Save Package</Button>
                            <Button onClick={() => setShowAddPackage(null)} size="sm" variant="ghost" className="text-foreground/50">Cancel</Button>
                          </div>
                        </div>
                      )}

                      {pkgs.length > 0 ? (
                        <div className="space-y-2">
                          {pkgs.map((pkg) => (
                            <div key={pkg.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                              <div>
                                <span className="font-sans text-sm font-medium text-foreground">{pkg.name}</span>
                                <span className="font-sans text-sm text-gold ml-2">{pkg.price}</span>
                                <p className="font-sans text-xs text-foreground/40 mt-0.5">{pkg.features.join(" • ")}</p>
                              </div>
                              <Button onClick={() => deletePackage.mutate(pkg.id)} variant="ghost" size="icon" className="text-destructive hover:text-destructive/80 h-7 w-7">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="font-sans text-xs text-foreground/30">No packages yet</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {tab === "projects" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-foreground">Manage Projects</h2>
              <Button onClick={() => setShowAddProject(!showAddProject)} className="gradient-gold text-primary-foreground">
                <Plus className="w-4 h-4 mr-1" /> Add Project
              </Button>
            </div>

            {showAddProject && (
              <div className="bg-card border border-border rounded-lg p-6 mb-6 space-y-4">
                <Input value={newProject.title} onChange={(e) => setNewProject((p) => ({ ...p, title: e.target.value }))} placeholder="Project Title *" className="bg-secondary border-border" maxLength={200} />
                <Textarea value={newProject.description} onChange={(e) => setNewProject((p) => ({ ...p, description: e.target.value }))} placeholder="Description" className="bg-secondary border-border resize-none" maxLength={500} />
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Input value={newProject.image_url} onChange={(e) => setNewProject((p) => ({ ...p, image_url: e.target.value }))} placeholder="Image URL" className="bg-secondary border-border" />
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject((p) => ({ ...p, category: e.target.value }))}
                    className="flex h-10 rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                  >
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select
                    value={newProject.service_id}
                    onChange={(e) => setNewProject((p) => ({ ...p, service_id: e.target.value }))}
                    className="flex h-10 rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                  >
                    <option value="">Link to service (optional)</option>
                    {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                  <Input type="date" value={newProject.event_date} onChange={(e) => setNewProject((p) => ({ ...p, event_date: e.target.value }))} className="bg-secondary border-border" />
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => addProject.mutate()} disabled={!newProject.title.trim() || addProject.isPending} className="gradient-gold text-primary-foreground">
                    {addProject.isPending ? "Adding..." : "Save Project"}
                  </Button>
                  <Button onClick={() => setShowAddProject(false)} variant="ghost" className="text-foreground/50">Cancel</Button>
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
                    <p className="font-sans text-xs text-foreground/40">
                      {project.category} {project.event_date && `• ${project.event_date}`}
                      {project.service_id && ` • Linked to service`}
                    </p>
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

        {/* Bookings Tab */}
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
