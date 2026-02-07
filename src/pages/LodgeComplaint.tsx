import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { KioskLayout } from "@/components/KioskLayout";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ServiceType, complaintTypes, submitComplaint } from "@/data/mockData";

type Step = "service" | "type" | "description" | "confirm";

const serviceOptions: { key: ServiceType; labelKey: string }[] = [
  { key: "electricity", labelKey: "electricity" },
  { key: "water", labelKey: "water" },
  { key: "gas", labelKey: "gas" },
];

const LodgeComplaint: React.FC = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>("service");
  const [service, setService] = useState<ServiceType | null>(null);
  const [complaintType, setComplaintType] = useState("");
  const [description, setDescription] = useState("");
  const [complaintId, setComplaintId] = useState("");

  const handleSubmit = () => {
    if (!service || !complaintType) return;
    const id = submitComplaint(service, t(complaintType), description);
    setComplaintId(id);
    setStep("confirm");
  };

  const stepNumber = { service: 1, type: 2, description: 3, confirm: 4 }[step];

  return (
    <KioskLayout showBack title={t("lodgeComplaint")}>
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors ${
              s <= stepNumber
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
        >
          {step === "service" && (
            <Card className="mx-auto max-w-lg">
              <CardHeader>
                <CardTitle className="text-center text-2xl">{t("selectService")}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {serviceOptions.map((opt) => (
                  <Button
                    key={opt.key}
                    variant="outline"
                    size="lg"
                    className={`h-16 text-lg justify-start gap-3 ${
                      service === opt.key ? "border-primary bg-primary/5 ring-2 ring-primary" : ""
                    }`}
                    onClick={() => {
                      setService(opt.key);
                      setStep("type");
                    }}
                  >
                    <FileText className="h-6 w-6" />
                    {t(opt.labelKey)}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}

          {step === "type" && service && (
            <Card className="mx-auto max-w-lg">
              <CardHeader>
                <CardTitle className="text-center text-2xl">{t("selectComplaintType")}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {complaintTypes[service].map((ct) => (
                  <Button
                    key={ct}
                    variant="outline"
                    size="lg"
                    className={`h-14 text-lg ${
                      complaintType === ct ? "border-primary bg-primary/5 ring-2 ring-primary" : ""
                    }`}
                    onClick={() => {
                      setComplaintType(ct);
                      setStep("description");
                    }}
                  >
                    {t(ct)}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}

          {step === "description" && (
            <Card className="mx-auto max-w-lg">
              <CardHeader>
                <CardTitle className="text-center text-2xl">{t("description")}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">{t("serviceType")}:</span>
                  <span>{t(service!)}</span>
                  <span className="mx-1">|</span>
                  <span className="font-medium">{t("complaintType")}:</span>
                  <span>{t(complaintType)}</span>
                </div>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("descriptionPlaceholder")}
                  className="min-h-[160px] text-lg"
                  maxLength={500}
                />
                <Button
                  size="lg"
                  className="h-14 text-lg gap-2"
                  onClick={handleSubmit}
                  disabled={!description.trim()}
                >
                  {t("submit")}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          )}

          {step === "confirm" && (
            <Card className="mx-auto max-w-lg border-kiosk-success/30">
              <CardContent className="flex flex-col items-center gap-6 pt-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <CheckCircle2 className="h-24 w-24 text-kiosk-success" />
                </motion.div>
                <h2 className="text-3xl font-extrabold text-kiosk-success">{t("complaintSubmitted")}</h2>
                <div className="w-full space-y-3 rounded-lg bg-muted p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t("complaintId")}</span>
                    <span className="text-xl font-extrabold font-mono text-foreground">{complaintId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t("serviceType")}</span>
                    <span className="font-semibold">{t(service!)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t("complaintType")}</span>
                    <span className="font-semibold">{t(complaintType)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t("date")}</span>
                    <span className="font-semibold">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="text-center text-muted-foreground">
                  {t("summary")}: {description.substring(0, 100)}
                  {description.length > 100 ? "..." : ""}
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </KioskLayout>
  );
};

export default LodgeComplaint;
