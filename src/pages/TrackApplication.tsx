import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Clock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { KioskLayout } from "@/components/KioskLayout";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComplaintStatus, lookupComplaint } from "@/data/mockData";

const statusConfig = {
  pending: {
    icon: Clock,
    colorClass: "text-kiosk-pending",
    bgClass: "bg-kiosk-pending/10",
    borderClass: "border-kiosk-pending/30",
  },
  in_progress: {
    icon: Loader2,
    colorClass: "text-kiosk-progress",
    bgClass: "bg-kiosk-progress/10",
    borderClass: "border-kiosk-progress/30",
  },
  resolved: {
    icon: CheckCircle2,
    colorClass: "text-kiosk-success",
    bgClass: "bg-kiosk-success/10",
    borderClass: "border-kiosk-success/30",
  },
};

const TrackApplication: React.FC = () => {
  const { t } = useLanguage();
  const [searchId, setSearchId] = useState("");
  const [result, setResult] = useState<ComplaintStatus | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = () => {
    setError("");
    const trimmed = searchId.trim();
    if (!trimmed) return;
    const found = lookupComplaint(trimmed);
    setResult(found);
    setSearched(true);
    if (!found) {
      setError("ID not found. Try: CMP-2026-00418, CMP-2026-00419, or CMP-2026-00420");
    }
  };

  const steps = [
    { status: "pending", label: t("pending"), desc: t("pendingDesc") },
    { status: "in_progress", label: t("inProgress"), desc: t("inProgressDesc") },
    { status: "resolved", label: t("resolved"), desc: t("resolvedDesc") },
  ];

  const activeStep = result
    ? result.status === "pending" ? 0 : result.status === "in_progress" ? 1 : 2
    : -1;

  return (
    <KioskLayout showBack title={t("trackApplication")}>
      <div className="mx-auto max-w-lg space-y-6">
        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">{t("enterComplaintId")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Input
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="e.g. CMP-2026-00418"
              className="h-14 text-lg"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            {error && <p className="text-center text-destructive text-sm">{error}</p>}
            <Button size="lg" className="h-14 text-lg gap-2" onClick={handleSearch}>
              <Search className="h-5 w-5" />
              {t("trackStatus")}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {searched && result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className={`${statusConfig[result.status].borderClass} border-2`}>
              <CardContent className="pt-6 space-y-6">
                {/* Status badge */}
                <div className="flex items-center justify-center">
                  <div className={`flex items-center gap-2 rounded-full px-5 py-2 ${statusConfig[result.status].bgClass}`}>
                    {React.createElement(statusConfig[result.status].icon, {
                      className: `h-6 w-6 ${statusConfig[result.status].colorClass}`,
                    })}
                    <span className={`text-xl font-bold ${statusConfig[result.status].colorClass}`}>
                      {t(result.status === "in_progress" ? "inProgress" : result.status)}
                    </span>
                  </div>
                </div>

                {/* Timeline stepper */}
                <div className="flex items-start justify-between">
                  {steps.map((step, i) => {
                    const isActive = i <= activeStep;
                    const isCurrent = i === activeStep;
                    return (
                      <div key={step.status} className="flex flex-1 flex-col items-center text-center">
                        <div className="relative flex flex-col items-center">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors ${
                              isActive
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted bg-muted text-muted-foreground"
                            } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                          >
                            {i + 1}
                          </div>
                          {i < steps.length - 1 && (
                            <div
                              className={`absolute left-full top-1/2 h-0.5 w-[calc(100%-3rem)] -translate-y-1/2 ${
                                i < activeStep ? "bg-primary" : "bg-muted"
                              }`}
                              style={{ left: "3rem", width: "calc(100% + 1rem)" }}
                            />
                          )}
                        </div>
                        <p className={`mt-2 text-sm font-bold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.label}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">{step.desc}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Details */}
                <div className="space-y-3 rounded-lg bg-muted p-4">
                  <DetailRow label={t("complaintId")} value={result.id} />
                  <DetailRow label={t("serviceType")} value={t(result.service)} />
                  <DetailRow label={t("complaintType")} value={result.type} />
                  <DetailRow label={t("date")} value={result.filedDate} />
                  {result.officerName && (
                    <DetailRow label="Officer" value={result.officerName} />
                  )}
                  {result.expectedResolution && (
                    <DetailRow label={t("expectedResolution")} value={result.expectedResolution} />
                  )}
                  {result.resolvedDate && (
                    <DetailRow label={t("resolvedOn")} value={result.resolvedDate} />
                  )}
                  {result.resolutionSummary && (
                    <div className="pt-2 border-t border-border">
                      <p className="text-sm text-muted-foreground">{t("summary")}</p>
                      <p className="mt-1 font-medium">{result.resolutionSummary}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {searched && !result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="border-destructive/30 border-2">
              <CardContent className="flex flex-col items-center gap-4 pt-6">
                <AlertCircle className="h-16 w-16 text-destructive" />
                <p className="text-lg font-semibold text-destructive">No record found</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </KioskLayout>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-semibold text-foreground">{value}</span>
  </div>
);

export default TrackApplication;
