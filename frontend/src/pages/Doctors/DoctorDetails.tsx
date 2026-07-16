import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Calendar, Clock, GraduationCap, Briefcase, MessageSquare } from "lucide-react";
import { getDoctor, type Doctor, type TimeSlot } from "../../api/doctors";
import { listDoctorReviews, type Review } from "../../api/reviews";
import { createBooking } from "../../api/bookings";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Skeleton } from "../../components/ui/skeleton";

const DAY_LABELS: Record<string, string> = {
  monday: "Lundi", tuesday: "Mardi", wednesday: "Mercredi",
  thursday: "Jeudi", friday: "Vendredi", saturday: "Samedi", sunday: "Dimanche",
};

function getDayName(date: Date): string {
  return ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][date.getDay()];
}

function generateTimeSlots(startTime: string, endTime: string): string[] {
  const slots: string[] = [];
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  let h = sh, m = sm;
  while (h < eh || (h === eh && m < em)) {
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    m += 30;
    if (m >= 60) { h += 1; m = 0; }
  }
  return slots;
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < Math.round(rating) ? "fill-yellowColor text-yellowColor" : "text-muted"}`} />
      ))}
    </span>
  );
}

export default function DoctorDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([getDoctor(id), listDoctorReviews(id)])
      .then(([doc, revs]) => { setDoctor(doc); setReviews(revs); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const today = new Date().toISOString().split("T")[0];
  const availableSlots: TimeSlot[] = selectedDate
    ? (doctor?.timeSlots ?? []).filter((ts) => getDayName(new Date(selectedDate + "T12:00:00")) === ts.day)
    : [];
  const timeSlotOptions = availableSlots.length > 0
    ? generateTimeSlots(availableSlots[0].startTime, availableSlots[0].endTime)
    : [];

  function handleBook() {
    if (!selectedDate || !selectedTime || !id) return;
    if (!token) { navigate(`/login?redirect=/doctor/${id}`); return; }
    setBookingLoading(true);
    setBookingError(null);
    const appointmentDate = `${selectedDate}T${selectedTime}:00.000Z`;
    createBooking({ doctorId: id, appointmentDate, notes: notes || undefined })
      .then(() => { setBookingSuccess(true); })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : "";
        if (msg.toLowerCase().includes("unavailable") || msg.toLowerCase().includes("conflict") || msg.toLowerCase().includes("slot")) {
          setBookingError("Ce créneau est déjà réservé. Veuillez en choisir un autre.");
        } else {
          setBookingError(msg || "Erreur lors de la réservation");
        }
      })
      .finally(() => setBookingLoading(false));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
          </div>
          <Skeleton className="h-80 rounded-xl lg:col-span-1" />
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Médecin introuvable.</p>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 text-center">
          <CardContent className="pt-10 pb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Rendez-vous confirmé</h2>
            <p className="text-muted-foreground mb-6">
              Votre rendez-vous avec {doctor.name} a été enregistré.
            </p>
            <Button onClick={() => navigate("/dashboard")}>Voir mes rendez-vous</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedDayLabel = selectedDate ? DAY_LABELS[getDayName(new Date(selectedDate + "T12:00:00"))] : "";

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left */}
        <div className="lg:col-span-2 space-y-6">

          {/* Profile */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-5">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {getInitials(doctor.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-foreground">{doctor.name}</h1>
                  <p className="text-primary font-medium mt-0.5">{doctor.specialization}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <StarRating rating={doctor.averageRating} />
                    <span className="font-medium text-foreground">{doctor.averageRating.toFixed(1)}</span>
                    <span>({doctor.totalReviews} avis)</span>
                    <span className="text-primary font-semibold text-base">
                      {doctor.ticketPrice.toLocaleString("fr-FR")} MAD
                    </span>
                  </div>
                </div>
              </div>
              {doctor.bio && <p className="mt-4 text-muted-foreground leading-relaxed">{doctor.bio}</p>}
              {doctor.about && <p className="mt-3 text-muted-foreground leading-relaxed">{doctor.about}</p>}
            </CardContent>
          </Card>

          {/* Qualifications */}
          {doctor.qualifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Diplômes et formations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {doctor.qualifications.map((q, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">{q.degree}</p>
                      {q.university && <p className="text-sm text-muted-foreground">{q.university}</p>}
                      {q.year && <p className="text-sm text-muted-foreground">{q.year}</p>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Experiences */}
          {doctor.experiences.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Expérience professionnelle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {doctor.experiences.map((e, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">{e.position}</p>
                      {e.hospital && <p className="text-sm text-muted-foreground">{e.hospital}</p>}
                      {(e.startDate || e.endDate) && (
                        <p className="text-sm text-muted-foreground">
                          {e.startDate ? new Date(e.startDate).toLocaleDateString("fr-FR") : "?"}
                          {" – "}
                          {e.endDate ? new Date(e.endDate).toLocaleDateString("fr-FR") : "Aujourd'hui"}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Avis patients
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{r.user.name}</span>
                      <StarRating rating={r.rating} />
                    </div>
                    <p className="text-sm text-muted-foreground">{r.reviewText}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right — Booking */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-5">
            <Card>
              <CardContent className="p-6 space-y-5">
                <div>
                  <p className="text-sm text-muted-foreground">Tarif</p>
                  <p className="text-2xl font-bold text-foreground">
                    {doctor.ticketPrice.toLocaleString("fr-FR")} MAD
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="date">Date du rendez-vous</Label>
                  <Input
                    id="date"
                    type="date"
                    min={today}
                    value={selectedDate}
                    onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(null); setBookingError(null); }}
                  />
                </div>

                {selectedDate && availableSlots.length === 0 && (
                  <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-2.5 rounded-lg">
                    <Clock className="w-4 h-4 shrink-0" />
                    Aucun créneau disponible pour cette date.
                  </div>
                )}

                {selectedDate && timeSlotOptions.length > 0 && (
                  <div className="space-y-2">
                    <Label>{selectedDayLabel}</Label>
                    <div className="flex flex-wrap gap-2">
                      {timeSlotOptions.map((slot) => {
                        const past = new Date(`${selectedDate}T${slot}:00`) <= new Date();
                        return (
                          <Button
                            key={slot}
                            variant={selectedTime === slot ? "default" : "outline"}
                            size="sm"
                            disabled={past}
                            onClick={() => { setSelectedTime(slot); setBookingError(null); }}
                          >
                            {slot}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedTime && (
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (optionnel)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Motif de la consultation…"
                      maxLength={1000}
                      rows={3}
                    />
                  </div>
                )}

                {bookingError && (
                  <div className="text-sm text-destructive bg-destructive/10 px-3 py-2.5 rounded-lg">
                    {bookingError}
                  </div>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleBook}
                  disabled={!selectedDate || !selectedTime || bookingLoading}
                >
                  {bookingLoading ? "Réservation en cours…" : "Réserver ce créneau"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
