import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CreditCard, CheckCircle2, Receipt, Printer, ArrowRight } from "lucide-react";
import { KioskLayout } from "@/components/KioskLayout";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceType, BillData, lookupBill, generateTransactionId } from "@/data/mockData";

type Step = "search" | "details" | "confirm" | "success" | "receipt";

const serviceLabels: Record<ServiceType, string> = {
  electricity: "electricityBill",
  water: "waterBill",
  gas: "gasService",
};

const BillPayment: React.FC = () => {
  const { service } = useParams<{ service: ServiceType }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [step, setStep] = useState<Step>("search");
  const [consumerNumber, setConsumerNumber] = useState("");
  const [bill, setBill] = useState<BillData | null>(null);
  const [txnId, setTxnId] = useState("");
  const [error, setError] = useState("");

  const serviceType = (service || "electricity") as ServiceType;
  const title = t(serviceLabels[serviceType] || "electricityBill");

  const handleSearch = () => {
    setError("");
    const trimmed = consumerNumber.trim();
    if (!trimmed) return;
    const found = lookupBill(trimmed, serviceType);
    if (found) {
      setBill(found);
      setStep("details");
    } else {
      setError("Consumer number not found. Try: 1001234567 or 2005678901");
    }
  };

  const handlePay = () => {
    setTxnId(generateTransactionId());
    setStep("success");
  };

  const stepNumber = { search: 1, details: 2, confirm: 3, success: 4, receipt: 5 }[step];

  return (
    <KioskLayout showBack title={title}>
      {/* Step indicator */}
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
          {step === "search" && (
            <Card className="mx-auto max-w-lg">
              <CardHeader>
                <CardTitle className="text-center text-2xl">{t("enterConsumerNumber")}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Input
                  value={consumerNumber}
                  onChange={(e) => setConsumerNumber(e.target.value)}
                  placeholder="e.g. 1001234567"
                  className="h-14 text-lg"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                {error && <p className="text-center text-destructive">{error}</p>}
                <Button size="lg" className="h-14 text-lg gap-2" onClick={handleSearch}>
                  <Search className="h-5 w-5" />
                  {t("search")}
                </Button>
              </CardContent>
            </Card>
          )}

          {step === "details" && bill && (
            <Card className="mx-auto max-w-lg">
              <CardHeader>
                <CardTitle className="text-center text-2xl">{t("billDetails")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <BillRow label={t("consumerName")} value={bill.consumerName} />
                <BillRow label={t("billingPeriod")} value={bill.billingPeriod} />
                <BillRow label={t("unitsConsumed")} value={String(bill.unitsConsumed)} />
                <BillRow label={t("connectionCharge")} value={`₹${bill.connectionCharge}`} />
                <BillRow label={t("meterRent")} value={`₹${bill.meterRent}`} />
                <BillRow label={t("dueDate")} value={bill.dueDate} />
                <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
                  <span className="text-lg font-bold">{t("totalAmount")}</span>
                  <span className="text-2xl font-extrabold text-primary">₹{bill.amountDue}</span>
                </div>
                <Button size="lg" className="h-14 w-full text-lg gap-2" onClick={() => setStep("confirm")}>
                  {t("payNow")}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          )}

          {step === "confirm" && bill && (
            <Card className="mx-auto max-w-lg">
              <CardHeader>
                <CardTitle className="text-center text-2xl">{t("confirmPayment")}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <CreditCard className="h-16 w-16 text-primary" />
                  <p className="text-lg text-muted-foreground">
                    {t("paymentOf")} <span className="font-bold text-foreground">₹{bill.amountDue}</span> {t("willBeProcessed")}
                  </p>
                </div>
                <div className="flex w-full gap-3">
                  <Button variant="outline" size="lg" className="h-14 flex-1 text-lg" onClick={() => setStep("details")}>
                    {t("cancel")}
                  </Button>
                  <Button size="lg" className="h-14 flex-1 text-lg gap-2" onClick={handlePay}>
                    <CreditCard className="h-5 w-5" />
                    {t("payNow")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === "success" && bill && (
            <Card className="mx-auto max-w-lg border-kiosk-success/30">
              <CardContent className="flex flex-col items-center gap-6 pt-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <CheckCircle2 className="h-24 w-24 text-kiosk-success" />
                </motion.div>
                <h2 className="text-3xl font-extrabold text-kiosk-success">{t("paymentSuccess")}</h2>
                <div className="w-full space-y-3 rounded-lg bg-muted p-4">
                  <BillRow label={t("transactionId")} value={txnId} />
                  <BillRow label={t("date")} value={new Date().toLocaleDateString()} />
                  <BillRow label={t("amount")} value={`₹${bill.amountDue}`} />
                  <BillRow label={t("consumerName")} value={bill.consumerName} />
                </div>
                <Button size="lg" className="h-14 w-full text-lg gap-2" onClick={() => setStep("receipt")}>
                  <Receipt className="h-5 w-5" />
                  {t("digitalReceipt")}
                </Button>
              </CardContent>
            </Card>
          )}

          {step === "receipt" && bill && (
            <Card className="mx-auto max-w-lg">
              <CardHeader className="border-b border-dashed border-border">
                <CardTitle className="text-center text-2xl">{t("digitalReceipt")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-primary">{t("appName")}</h3>
                  <p className="text-sm text-muted-foreground">{t("tagline")}</p>
                </div>
                <div className="space-y-2 border-y border-dashed border-border py-4">
                  <BillRow label={t("transactionId")} value={txnId} />
                  <BillRow label={t("date")} value={new Date().toLocaleDateString()} />
                  <BillRow label={t("serviceType")} value={title} />
                  <BillRow label={t("consumerName")} value={bill.consumerName} />
                  <BillRow label={t("billingPeriod")} value={bill.billingPeriod} />
                  <BillRow label={t("unitsConsumed")} value={String(bill.unitsConsumed)} />
                </div>
                <div className="flex items-center justify-between rounded-lg bg-kiosk-success/10 p-4">
                  <span className="text-lg font-bold">{t("totalAmount")}</span>
                  <span className="text-2xl font-extrabold text-kiosk-success">₹{bill.amountDue}</span>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="lg" className="h-14 flex-1 text-lg gap-2" onClick={() => window.print()}>
                    <Printer className="h-5 w-5" />
                    {t("printDownload")}
                  </Button>
                  <Button size="lg" className="h-14 flex-1 text-lg" onClick={() => navigate("/")}>
                    {t("newPayment")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </KioskLayout>
  );
};

const BillRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-semibold text-foreground">{value}</span>
  </div>
);

export default BillPayment;
