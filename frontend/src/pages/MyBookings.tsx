import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Star, Loader2, X } from "lucide-react";
import { listMyBookings, type Booking } from "../api/bookings";
import { createReview } from "../api/reviews";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Skeleton } from "../components/ui/skeleton";
import { Textarea } from "../components/ui/textarea";

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const STATUS_CONFIG: Record<string, { label: string; variant: "warning" | "success" | "destructive" | "default" }> = {
  pending: { label: "En attente", variant: "warning" },
  approved: { label: "Confirmé", variant: "success" },
  cancelled: { label: "Annulé", variant: "destructive" },
  completed: { label: "Terminé", variant: "success" },
};

function ReviewModal({
  booking,
  open,
  onClose,
}: {
  booking: Booking;
  open: boolean;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  async function handleSubmit() {
    if (rating === 0) { setError("Veuillez choisir une note"); return; }
    if (reviewText.trim().length < 3) { setError("Veuillez écrire un avis (min. 3 caractères)"); return; }
    setSubmitting(true);
    setError(null);
    try {
      await createReview({ bookingId: booking.id, rating, reviewText: reviewText.trim() });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <Card
        className="w-full max-w-md bg-background"
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="p-6">
          {success ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Star className="w-7 h-7 text-primary fill-primary" />
              </div>
              <h3 className="text-lg font-bold mb-1">Avis envoyé !</h3>
              <p className="text-sm text-muted-foreground mb-4">Merci pour votre retour.</p>
              <Button variant="outline" onClick={onClose}>Fermer</Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Laisser un avis</h3>
                <button onClick={onClose} className="p-1 hover:bg-muted rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {booking.doctor.name} — {new Date(booking.appointmentDate).toLocaleDateString("fr-FR")}
              </p>

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => {
                  const star = i + 1;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(star)}
                      className="p-0.5"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= (hover || rating)
                            ? "fill-yellowColor text-yellowColor"
                            : "text-muted"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <Textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Partagez votre expérience…"
                rows={4}
                maxLength={2000}
                className="mb-4"
              />

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Envoyer mon avis
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function BookingRow({
  booking,
  onReview,
}: {
  booking: Booking;
  onReview: (b: Booking) => void;
}) {
  const config = STATUS_CONFIG[booking.status] ?? { label: booking.status, variant: "default" as const };
  return (
    <Card>
      <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
              {getInitials(booking.doctor.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{booking.doctor.name}</p>
            <p className="text-sm text-muted-foreground">{booking.doctor.specialization}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
          <Calendar className="w-4 h-4" />
          {new Date(booking.appointmentDate).toLocaleDateString("fr-FR", {
            day: "numeric", month: "long", year: "numeric",
            hour: "2-digit", minute: "2-digit",
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant={config.variant} className="self-start sm:self-center">
            {config.label}
          </Badge>
          {booking.status === "completed" && (
            <Button variant="outline" size="sm" onClick={() => onReview(booking)}>
              <Star className="w-3.5 h-3.5 mr-1" />
              Avis
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SkeletonRow() {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
        <Skeleton className="h-6 w-24 shrink-0" />
      </div>
    </Card>
  );
}

export default function MyBookings() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <Skeleton className="h-8 w-48" />
          {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Connectez-vous pour voir vos rendez-vous.</p>
        <Link to="/login">
          <Button>Se connecter</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-foreground mb-6">Mes rendez-vous</h1>

        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-lg text-muted-foreground mb-4">Aucun rendez-vous pour le moment.</p>
            <Link to="/doctors">
              <Button>
                Trouver un médecin
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => <BookingRow key={b.id} booking={b} onReview={setReviewBooking} />)}
          </div>
        )}

        {reviewBooking && (
          <ReviewModal
            booking={reviewBooking}
            open={!!reviewBooking}
            onClose={() => setReviewBooking(null)}
          />
        )}
      </div>
    </div>
  );
}
