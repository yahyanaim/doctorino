import { useState, useEffect, useCallback } from "react";
import { Check, X, RefreshCw } from "lucide-react";
import { listDoctors, updateDoctorApproval, type Doctor } from "../../api/doctors";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Skeleton } from "../../components/ui/skeleton";

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function PendingDoctorRow({
  doctor,
  onAction,
  loading,
}: {
  doctor: Doctor;
  onAction: (id: string, status: string) => void;
  loading: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-amber-50 text-amber-700 text-base font-bold">
              {getInitials(doctor.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{doctor.name}</p>
            <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
            <p className="text-sm text-muted-foreground truncate">{doctor.email}</p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => onAction(doctor.id, "approved")}
            disabled={loading}
          >
            <Check className="w-4 h-4 mr-1" />
            Approuver
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onAction(doctor.id, "rejected")}
            disabled={loading}
          >
            <X className="w-4 h-4 mr-1" />
            Refuser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DoctorApprovals() {
  const { user, loading: authLoading } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listDoctors({ limit: 100 });
      setDoctors(result.items.filter((d) => d.approvalStatus === "pending"));
    } catch {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    fetchPending();
  }, [authLoading, fetchPending]);

  async function handleApproval(id: string, status: string) {
    setActionLoading(true);
    try {
      await updateDoctorApproval(id, status);
      setDoctors((prev) => prev.filter((d) => d.id !== id));
    } catch {
      // handled
    } finally {
      setActionLoading(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <Skeleton className="h-8 w-64" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Accès réservé aux administrateurs.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Approbations médecins</h1>
            <p className="text-muted-foreground mt-1">
              {doctors.length} médecin{doctors.length > 1 ? "s" : ""} en attente
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchPending}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Actualiser
          </Button>
        </div>

        {doctors.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-lg text-muted-foreground">Aucun médecin en attente d'approbation.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {doctors.map((doc) => (
              <PendingDoctorRow
                key={doc.id}
                doctor={doc}
                onAction={handleApproval}
                loading={actionLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
