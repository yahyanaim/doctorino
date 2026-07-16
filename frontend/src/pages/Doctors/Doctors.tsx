import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, Star, MapPin } from "lucide-react";
import { listDoctors, type Doctor } from "../../api/doctors";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Skeleton } from "../../components/ui/skeleton";

const SPECIALIZATIONS = [
  "Cardiologie",
  "Dermatologie",
  "Pédiatrie",
  "Gynécologie",
  "Ophtalmologie",
  "ORL",
  "Neurologie",
  "Psychiatrie",
  "Radiologie",
  "Chirurgie",
  "Médecine générale",
];

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Card className="flex flex-col">
      <CardContent className="p-5 flex-1">
        <div className="flex items-start gap-4">
          <Avatar className="w-14 h-14">
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
              {getInitials(doctor.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground truncate">{doctor.name}</h3>
            <p className="text-sm text-primary font-medium">{doctor.specialization}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellowColor text-yellowColor" />
            <span className="text-foreground font-medium">{doctor.averageRating.toFixed(1)}</span>
          </span>
          <span>({doctor.totalReviews} avis)</span>
        </div>

        <div className="mt-3">
          <span className="text-lg font-bold text-primary">
            {doctor.ticketPrice.toLocaleString("fr-FR")} MAD
          </span>
        </div>
      </CardContent>
      <CardFooter className="px-5 pb-5 pt-0">
        <Link to={`/doctor/${doctor.id}`} className="w-full">
          <Button className="w-full" size="sm">
            Voir profil
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <Skeleton className="w-14 h-14 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-4 w-1/2 mt-4" />
      <Skeleton className="h-6 w-20 mt-3" />
      <Skeleton className="h-9 w-full mt-4" />
    </Card>
  );
}

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listDoctors({
        search: search || undefined,
        specialization: specialization || undefined,
        page,
        limit,
      });
      setDoctors(result.items);
      setTotal(result.meta.total);
    } catch {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [search, specialization, page]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Nos médecins</h1>
          <p className="text-muted-foreground mt-1">
            {total > 0 ? `${total} médecin${total > 1 ? "s" : ""} disponible${total > 1 ? "s" : ""}` : "Trouvez le spécialiste qu'il vous faut"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Rechercher par nom ou spécialité…"
              className="pl-9"
            />
          </div>
          <Select
            value={specialization}
            onValueChange={(v) => { setSpecialization(v === "all" ? "" : v); setPage(1); }}
          >
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="Toutes les spécialités" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les spécialités</SelectItem>
              {SPECIALIZATIONS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground mb-4">Aucun médecin trouvé.</p>
            <Button
              variant="outline"
              onClick={() => { setSearch(""); setSpecialization(""); }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {doctors.map((doc) => (
                <DoctorCard key={doc.id} doctor={doc} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Précédent
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} sur {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Suivant
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
