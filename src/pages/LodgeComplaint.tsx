import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, CheckCircle2, ArrowRight, Building2, Zap, Droplets, Flame, Landmark } from "lucide-react";
import { KioskLayout } from "@/components/KioskLayout";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitComplaint } from "@/data/mockData";
import type { ServiceType } from "@/data/mockData";
import { useOffline } from "@/contexts/OfflineContext";

type DepartmentType = ServiceType | "municipal";
type Step = "department" | "issueType" | "questions" | "summary" | "confirm";

const departments: { key: DepartmentType; labelKey: string; icon: React.ElementType }[] = [
  { key: "electricity", labelKey: "electricity", icon: Zap },
  { key: "water", labelKey: "water", icon: Droplets },
  { key: "gas", labelKey: "gas", icon: Flame },
  { key: "municipal", labelKey: "municipal", icon: Landmark },
];

const issueTypes: Record<DepartmentType, string[]> = {
  electricity: ["noSupply", "billingIssue", "meterFault", "other"],
  water: ["noSupply", "billingIssue", "leakage", "lowPressure", "other"],
  gas: ["noSupply", "billingIssue", "leakage", "other"],
  municipal: ["roadDamage", "streetLight", "garbageCollection", "drainage", "other"],
};

const TOTAL_STEPS = 5;

const LodgeComplaint: React.FC = () => {
  const { t } = useLanguage();
  const { isOffline, addPendingRequest } = useOffline();
  const [step, setStep] = useState<Step>("department");
  const [department, setDepartment] = useState<DepartmentType | null>(null);
  const [issueType, setIssueType] = useState("");
  const [sinceWhen, setSinceWhen] = useState("");
  const [affectedArea, setAffectedArea] = useState("");
  const [description, setDescription] = useState("");
  const [complaintId, setComplaintId] = useState("");

  const stepNumber = { department: 1, issueType: 2, questions: 3, summary: 4, confirm: 5 }[step];

  const autoSummary = `${t("department")}: ${department ? t(department) : ""}\n${t("issueType")}: ${t(issueType)}\n${t("sinceDuration")}: ${sinceWhen}\n${t("affectedScope")}: ${affectedArea ? t(affectedArea) : "-"}\n${description ? `\n${t("additionalDetails")}: ${description}` : ""}`;

  const handleSubmit = () => {
    if (!department || !issueType) return;
    if (isOffline) {
      const id = `SVD-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      addPendingRequest({ type: "complaint", department, issueType, sinceWhen, affectedArea, description });
      setComplaintId(id + " (Queued)");
    } else {
      const svc = department === "municipal" ? "electricity" : department;
      const id = submitComplaint(svc as ServiceType, t(issueType), autoSummary);
      // Replace CMP prefix with SVD
      setComplaintId(id.replace("CMP", "SVD"));
    }
    setStep("confirm");
  };

  return (
    <KioskLayout showBack title={t("lodgeComplaint")}>
      {/* Progress bar */}
      <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
        <span>{t("step")} {stepNumber} {t("of")} {TOTAL_STEPS}</span>
        <span>{Math.round((stepNumber / TOTAL_STEPS) * 100)}%</span>
      </div>
      <Progress value={(stepNumber / TOTAL_STEPS) * 100} className="mb-6 h-3" />

      {/* Step indicator circles */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
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
          {step === "department" && (
            <Card className="mx-auto max-w-lg">
              <CardHeader>
                <CardTitle className="text-center text-2xl">{t("selectDepartment")}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {departments.map((dept) => {
                  const Icon = dept.icon;
                  return (
                    <Button
                      key={dept.key}
                      variant="outline"
                      size="lg"
                      className={`h-16 text-lg justify-start gap-3 ${
                        department === dept.key ? "border-primary bg-primary/5 ring-2 ring-primary" : ""
                      }`}
                      onClick={() => {
                        setDepartment(dept.key);
                        setStep("issueType");
                      }}
                    >
                      <Icon className="h-6 w-6" />
                      {t(dept.labelKey)}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {step === "issueType" && department && (
            <Card className="mx-auto max-w-lg">
              <CardHeader>
                <CardTitle className="text-center text-2xl">{t("selectIssueType")}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {issueTypes[department].map((ct) => (
                  <Button
                    key={ct}
                    variant="outline"
                    size="lg"
                    className={`h-14 text-lg ${
                      issueType === ct ? "border-primary bg-primary/5 ring-2 ring-primary" : ""
                    }`}
                    onClick={() => {
                      setIssueType(ct);
                      setStep("questions");
                    }}
                  >
                    {t(ct)}
                  </Button>
                ))}
                <Button variant="ghost" className="mt-2" onClick={() => { setStep("department"); setIssueType(""); }}>
                  ← {t("back")}
                </Button>
              </CardContent>
            </Card>
          )}

          {step === "questions" && (
            <Card className="mx-auto max-w-lg">
              <CardHeader>
                <CardTitle className="text-center text-2xl">{t("guidedQuestions")}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div>
                  <label className="mb-2 block text-base font-semibold text-foreground">{t("sinceWhenQuestion")}</label>
                  <Select value={sinceWhen} onValueChange={setSinceWhen}>
                    <SelectTrigger className="h-14 text-lg">
                      <SelectValue placeholder={t("selectDuration")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">{t("today")}</SelectItem>
                      <SelectItem value="fewDays">{t("fewDays")}</SelectItem>
                      <SelectItem value="oneWeek">{t("oneWeek")}</SelectItem>
                      <SelectItem value="moreThanWeek">{t("moreThanWeek")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-base font-semibold text-foreground">{t("affectedAreaQuestion")}</label>
                  <Select value={affectedArea} onValueChange={setAffectedArea}>
                    <SelectTrigger className="h-14 text-lg">
                      <SelectValue placeholder={t("selectScope")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="onlyPremises">{t("onlyPremises")}</SelectItem>
                      <SelectItem value="entireArea">{t("entireArea")}</SelectItem>
                      <SelectItem value="notSure">{t("notSure")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-base font-semibold text-foreground">{t("additionalDetails")}</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("descriptionPlaceholder")}
                    className="min-h-[120px] text-lg"
                    maxLength={500}
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" size="lg" className="h-14 flex-1 text-lg" onClick={() => setStep("issueType")}>
                    ← {t("back")}
                  </Button>
                  <Button
                    size="lg"
                    className="h-14 flex-1 text-lg gap-2"
                    onClick={() => setStep("summary")}
                    disabled={!sinceWhen}
                  >
                    {t("next")} <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === "summary" && (
            <Card className="mx-auto max-w-lg">
              <CardHeader>
                <CardTitle className="text-center text-2xl">{t("reviewSummary")}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="space-y-3 rounded-lg bg-muted p-4 text-base">
                  <SummaryRow label={t("department")} value={department ? t(department) : ""} />
                  <SummaryRow label={t("issueType")} value={t(issueType)} />
                  <SummaryRow label={t("sinceDuration")} value={sinceWhen ? t(sinceWhen) : "-"} />
                  <SummaryRow label={t("affectedScope")} value={affectedArea ? t(affectedArea) : "-"} />
                  {description && (
                    <div className="pt-2 border-t border-border">
                      <p className="text-sm text-muted-foreground">{t("additionalDetails")}</p>
                      <p className="mt-1 font-medium">{description}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="lg" className="h-14 flex-1 text-lg" onClick={() => setStep("questions")}>
                    ← {t("back")}
                  </Button>
                  <Button
                    size="lg"
                    className="h-14 flex-1 text-lg gap-2"
                    onClick={handleSubmit}
                  >
                    {t("submit")} <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
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
                  <SummaryRow label={t("complaintId")} value={complaintId} bold />
                  <SummaryRow label={t("department")} value={department ? t(department) : ""} />
                  <SummaryRow label={t("issueType")} value={t(issueType)} />
                  <SummaryRow label={t("date")} value={new Date().toLocaleDateString()} />
                </div>
                {isOffline && (
                  <div className="rounded-lg bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive">
                    {t("offlineQueued")}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </KioskLayout>
  );
};

const SummaryRow: React.FC<{ label: string; value: string; bold?: boolean }> = ({ label, value, bold }) => (
  <div className="flex items-center justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className={`${bold ? "text-xl font-extrabold font-mono" : "font-semibold"} text-foreground`}>{value}</span>
  </div>
);

export default LodgeComplaint;
