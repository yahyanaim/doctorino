import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { post } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS: Record<string, string> = {
  monday: "Lundi", tuesday: "Mardi", wednesday: "Mercredi",
  thursday: "Jeudi", friday: "Vendredi", saturday: "Samedi", sunday: "Dimanche",
};

interface Qualification { degree: string; university: string; year: string }
interface Experience { position: string; hospital: string; startDate: string; endDate: string }
interface TimeSlot { day: string; startTime: string; endTime: string }

export default function CreateDoctor() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [bio, setBio] = useState("");
  const [about, setAbout] = useState("");
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (authLoading) return null;
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Accès réservé aux administrateurs.</p>
      </div>
    );
  }

  function addQualification() { setQualifications([...qualifications, { degree: "", university: "", year: "" }]); }
  function updateQualification(i: number, field: keyof Qualification, value: string) {
    const copy = [...qualifications];
    copy[i] = { ...copy[i], [field]: value };
    setQualifications(copy);
  }
  function removeQualification(i: number) { setQualifications(qualifications.filter((_, idx) => idx !== i)); }

  function addExperience() { setExperiences([...experiences, { position: "", hospital: "", startDate: "", endDate: "" }]); }
  function updateExperience(i: number, field: keyof Experience, value: string) {
    const copy = [...experiences];
    copy[i] = { ...copy[i], [field]: value };
    setExperiences(copy);
  }
  function removeExperience(i: number) { setExperiences(experiences.filter((_, idx) => idx !== i)); }

  function addTimeSlot() { setTimeSlots([...timeSlots, { day: "monday", startTime: "09:00", endTime: "17:00" }]); }
  function updateTimeSlot(i: number, field: keyof TimeSlot, value: string) {
    const copy = [...timeSlots];
    copy[i] = { ...copy[i], [field]: value };
    setTimeSlots(copy);
  }
  function removeTimeSlot(i: number) { setTimeSlots(timeSlots.filter((_, idx) => idx !== i)); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || !name || !specialization || !ticketPrice) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        email,
        password,
        name,
        phone: phone || undefined,
        specialization,
        ticketPrice: Number(ticketPrice),
        bio: bio || undefined,
        about: about || undefined,
        qualifications: qualifications.filter((q) => q.degree).map((q) => ({
          degree: q.degree,
          university: q.university || undefined,
          year: q.year ? Number(q.year) : undefined,
        })),
        experiences: experiences.filter((e) => e.position).map((e) => ({
          position: e.position,
          hospital: e.hospital || undefined,
          startDate: e.startDate || undefined,
          endDate: e.endDate || undefined,
        })),
        timeSlots: timeSlots.filter((ts) => ts.day).map((ts) => ({
          day: ts.day,
          startTime: ts.startTime,
          endTime: ts.endTime,
        })),
      };
      await post("/doctors", payload);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 text-center">
          <CardContent className="pt-10 pb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Médecin créé</h2>
            <p className="text-muted-foreground mb-6">
              Le compte médecin a été créé avec succès.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => { setSuccess(false); setEmail(""); setPassword(""); setName(""); setPhone(""); setSpecialization(""); setTicketPrice(""); setBio(""); setAbout(""); setQualifications([]); setExperiences([]); setTimeSlots([]); }}>
                Créer un autre
              </Button>
              <Button variant="outline" onClick={() => navigate("/admin/doctors")}>
                Voir les approbations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Ajouter un médecin</h1>
          <p className="text-muted-foreground mt-1">Créez un nouveau compte médecin.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations de base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Ahmed El Amrani" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Spécialité *</Label>
                  <Input id="specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="Cardiologie" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="dr.ahmed@example.com" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe *</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 caractères" required minLength={8} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+212 6XX XX XX XX" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticketPrice">Prix consultation (MAD) *</Label>
                <Input id="ticketPrice" type="number" min="0" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} placeholder="300" required />
              </div>
            </CardContent>
          </Card>

          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio (court)</Label>
                <Input id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Spécialiste en cardiologie interventionnelle" maxLength={160} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about">À propos</Label>
                <Textarea id="about" value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Description détaillée..." rows={4} maxLength={5000} />
              </div>
            </CardContent>
          </Card>

          {/* Qualifications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Diplômes et formations</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addQualification}>
                <Plus className="w-4 h-4 mr-1" /> Ajouter
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {qualifications.length === 0 && <p className="text-sm text-muted-foreground">Aucun diplôme ajouté.</p>}
              {qualifications.map((q, i) => (
                <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input placeholder="Diplôme *" value={q.degree} onChange={(e) => updateQualification(i, "degree", e.target.value)} />
                    <Input placeholder="Université" value={q.university} onChange={(e) => updateQualification(i, "university", e.target.value)} />
                    <Input placeholder="Année" type="number" value={q.year} onChange={(e) => updateQualification(i, "year", e.target.value)} />
                  </div>
                  <button type="button" onClick={() => removeQualification(i)} className="p-1 text-destructive hover:bg-destructive/10 rounded mt-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Experiences */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Expérience professionnelle</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addExperience}>
                <Plus className="w-4 h-4 mr-1" /> Ajouter
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {experiences.length === 0 && <p className="text-sm text-muted-foreground">Aucune expérience ajoutée.</p>}
              {experiences.map((e, i) => (
                <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input placeholder="Poste *" value={e.position} onChange={(e2) => updateExperience(i, "position", e2.target.value)} />
                    <Input placeholder="Hôpital / clinique" value={e.hospital} onChange={(e2) => updateExperience(i, "hospital", e2.target.value)} />
                    <Input placeholder="Date début" type="date" value={e.startDate} onChange={(e2) => updateExperience(i, "startDate", e2.target.value)} />
                    <Input placeholder="Date fin" type="date" value={e.endDate} onChange={(e2) => updateExperience(i, "endDate", e2.target.value)} />
                  </div>
                  <button type="button" onClick={() => removeExperience(i)} className="p-1 text-destructive hover:bg-destructive/10 rounded mt-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Time slots */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Créneaux horaires</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addTimeSlot}>
                <Plus className="w-4 h-4 mr-1" /> Ajouter
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {timeSlots.length === 0 && <p className="text-sm text-muted-foreground">Aucun créneau ajouté.</p>}
              {timeSlots.map((ts, i) => (
                <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <Select value={ts.day} onValueChange={(v) => updateTimeSlot(i, "day", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS.map((d) => (
                            <SelectItem key={d} value={d}>{DAY_LABELS[d]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Input type="time" value={ts.startTime} onChange={(e) => updateTimeSlot(i, "startTime", e.target.value)} />
                    <Input type="time" value={ts.endTime} onChange={(e) => updateTimeSlot(i, "endTime", e.target.value)} />
                  </div>
                  <button type="button" onClick={() => removeTimeSlot(i)} className="p-1 text-destructive hover:bg-destructive/10 rounded mt-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2.5 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" size="lg" disabled={submitting}>
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Créer le médecin
          </Button>
        </form>
      </div>
    </div>
  );
}
