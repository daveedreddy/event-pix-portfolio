import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle();
        if (data) navigate("/admin");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    // Check admin role
    const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id).eq("role", "admin").maybeSingle();
    if (!roleData) {
      await supabase.auth.signOut();
      toast({ title: "Access denied", description: "You don't have admin privileges.", variant: "destructive" });
      setLoading(false);
      return;
    }
    navigate("/admin");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full gradient-gold flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Admin Login</h1>
          <p className="font-sans text-sm text-foreground/50 mt-2">Creative Photography Dashboard</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-secondary border-border focus:border-gold"
            maxLength={255}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-secondary border-border focus:border-gold"
          />
          <Button type="submit" disabled={loading} className="w-full gradient-gold text-primary-foreground font-sans font-semibold tracking-wider uppercase hover:opacity-90">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <a href="/" className="block text-center mt-6 font-sans text-sm text-foreground/40 hover:text-gold transition-colors">
          ← Back to Website
        </a>
      </div>
    </div>
  );
};

export default AdminLogin;
