import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Stethoscope, LogOut, LayoutDashboard, ShieldCheck, Plus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const NAV_LINKS = [
  { to: "/", label: "Accueil" },
  { to: "/doctors", label: "Médecins" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
          <Stethoscope className="w-6 h-6 text-primary" />
          Doctorino
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <LayoutDashboard className="w-4 h-4" />
                  Mes rendez-vous
                </Button>
              </Link>
              {user.role === "admin" && (
                <>
                  <Link to="/admin/doctors">
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      Approbations
                    </Button>
                  </Link>
                  <Link to="/admin/doctors/create">
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <Plus className="w-4 h-4" />
                      Ajouter médecin
                    </Button>
                  </Link>
                </>
              )}
              <div className="flex items-center gap-2 pl-2 border-l">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground">{user.name}</span>
                <Button variant="ghost" size="icon" className="w-8 h-8" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Connexion</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Inscription</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground py-1"
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-border" />
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block text-sm font-medium py-1">
                Mes rendez-vous
              </Link>
              {user.role === "admin" && (
                <>
                  <Link to="/admin/doctors" onClick={() => setMobileOpen(false)} className="block text-sm font-medium py-1">
                    Approbations
                  </Link>
                  <Link to="/admin/doctors/create" onClick={() => setMobileOpen(false)} className="block text-sm font-medium py-1">
                    Ajouter médecin
                  </Link>
                </>
              )}
              <button onClick={handleLogout} className="text-sm text-destructive font-medium py-1">
                Déconnexion
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                <Button variant="outline" className="w-full" size="sm">Connexion</Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1">
                <Button className="w-full" size="sm">Inscription</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
