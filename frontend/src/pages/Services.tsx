import { Link } from "react-router-dom";
import { ArrowRight, Heart, Brain, Eye, Ear, Baby, Microscope, Bone, Stethoscope, Syringe, Activity } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const services = [
  { icon: Heart, title: "Cardiologie", desc: "Consultations et examens cardiaques pour prendre soin de votre cœur." },
  { icon: Brain, title: "Neurologie", desc: "Prise en charge des troubles du système nerveux." },
  { icon: Baby, title: "Pédiatrie", desc: "Suivi médical pour enfants et adolescents." },
  { icon: Eye, title: "Ophtalmologie", desc: "Examens de la vue et traitement des pathologies oculaires." },
  { icon: Ear, title: "ORL", desc: "Traitement des troubles de l'oreille, du nez et de la gorge." },
  { icon: Bone, title: "Orthopédie", desc: "Prise en charge des problèmes osseux et articulaires." },
  { icon: Microscope, title: "Radiologie", desc: "Examens d'imagerie médicale (Radio, IRM, Scanner)." },
  { icon: Activity, title: "Médecine générale", desc: "Consultations générales et suivi médical courant." },
  { icon: Syringe, title: "Dermatologie", desc: "Traitement des maladies de la peau et des muqueuses." },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground">Nos services médicaux</h1>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            Nous collaborons avec des spécialistes dans toutes les disciplines médicales pour vous offrir les meilleurs soins.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <Card key={i} className="group hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Vous ne trouvez pas la spécialité que vous cherchez ?</p>
          <Link to="/doctors">
            <Button className="gap-2">
              Voir tous les médecins
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
