import { Link } from "react-router-dom";
import { Stethoscope, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = [
  {
    title: "Navigation",
    links: [
      { to: "/", label: "Accueil" },
      { to: "/doctors", label: "Médecins" },
      { to: "/services", label: "Services" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Patients",
    links: [
      { to: "/login", label: "Connexion" },
      { to: "/signup", label: "Inscription" },
      { to: "/dashboard", label: "Mes rendez-vous" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t bg-card mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-foreground mb-3">
              <Stethoscope className="w-6 h-6 text-primary" />
              Doctorino
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Votre plateforme de prise de rendez-vous médicaux au Maroc. Trouvez le bon spécialiste et réservez en ligne.
            </p>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-foreground mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-semibold text-foreground mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                Casablanca, Maroc
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                +212 5XX XX XX XX
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                contact@doctorino.ma
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Doctorino. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
