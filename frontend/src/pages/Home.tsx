import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Search, Shield, Stethoscope, Star, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const features = [
  {
    icon: Search,
    title: "Trouvez un spécialiste",
    desc: "Parcourez notre annuaire de médecins par spécialité, localisation ou nom.",
  },
  {
    icon: Calendar,
    title: "Réservez en ligne",
    desc: "Choisissez votre créneau et réservez en quelques clics, 24h/24.",
  },
  {
    icon: Shield,
    title: "Confirmé en toute sécurité",
    desc: "Vos rendez-vous sont confirmés et gérés directement depuis votre tableau de bord.",
  },
];

const stats = [
  { value: "200+", label: "Médecins partenaires" },
  { value: "15", label: "Spécialités" },
  { value: "5 000+", label: "Patients satisfaits" },
];

const testimonials = [
  {
    name: "Fatima B.",
    text: "J'ai trouvé un excellent cardiologue en quelques minutes. La prise de rendez-vous est très simple et rapide.",
    rating: 5,
  },
  {
    name: "Karim E.",
    text: "Plus besoin d'attendre au téléphone. Je réserve tous mes rendez-vous sur Doctorino maintenant.",
    rating: 5,
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Prenez rendez-vous avec<br />
              <span className="text-primary">le bon spécialiste</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-lg">
              Doctorino vous permet de trouver et réserver une consultation chez les meilleurs médecins au Maroc, simplement et rapidement.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/doctors">
                <Button size="lg" className="gap-2">
                  Trouver un médecin
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg">
                  Nos services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-card">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-3 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-10">Comment ça marche</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Card key={i}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <f.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-10">Ce que disent nos patients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {testimonials.map((t, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`w-4 h-4 ${j < t.rating ? "fill-yellowColor text-yellowColor" : "text-muted"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 italic">"{t.text}"</p>
                  <p className="font-medium text-foreground text-sm">{t.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="bg-primary rounded-2xl p-10 md:p-14">
            <h2 className="text-3xl font-bold text-primary-foreground mb-3">
              Prêt à prendre rendez-vous ?
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">
              Rejoignez des milliers de patients qui réservent leurs consultations en ligne.
            </p>
            <Link to="/doctors">
              <Button size="lg" variant="secondary" className="gap-2">
                Commencer maintenant
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
