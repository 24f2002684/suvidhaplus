import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ShieldCheck, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useAuth } from "@/contexts/AuthContext";

type Step = "mobile" | "sending" | "otp" | "verifying";

const Login: React.FC = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [step, setStep] = useState<Step>("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [error, setError] = useState("");

  const handleSendOtp = () => {
    const trimmed = mobile.replace(/\s/g, "");
    if (!/^\d{10}$/.test(trimmed)) {
      setError(t("invalidMobile"));
      return;
    }
    setError("");
    setStep("sending");
    const simOtp = String(Math.floor(1000 + Math.random() * 9000));
    setGeneratedOtp(simOtp);
    setTimeout(() => setStep("otp"), 1500);
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 4) {
      setError(t("enterOtp"));
      return;
    }
    setError("");
    setStep("verifying");
    setTimeout(() => {
      if (otp === generatedOtp) {
        login(mobile);
      } else {
        setError(t("invalidOtp"));
        setStep("otp");
      }
    }, 1200);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border bg-primary px-6 py-4">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary-foreground">
            {t("appName")}
          </h1>
          <span className="hidden text-sm font-medium text-primary-foreground/70 sm:inline">
            {t("tagline")}
          </span>
        </div>
        <LanguageSelector />
      </header>

      <main className="flex flex-1 items-center justify-center p-6">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-2">
            <CardContent className="flex flex-col items-center gap-6 pt-8 pb-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-10 w-10 text-primary" />
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-extrabold text-foreground">{t("kioskLogin")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t("publicKioskMode")}</p>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-kiosk-success/10 px-4 py-1.5">
                <div className="h-2 w-2 rounded-full bg-kiosk-success animate-pulse" />
                <span className="text-sm font-semibold text-kiosk-success">{t("publicKioskEnabled")}</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  className="w-full space-y-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {(step === "mobile" || step === "sending") && (
                    <>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/[^0-9\s]/g, ""))}
                          placeholder={t("enterMobile")}
                          className="h-16 pl-12 text-xl"
                          maxLength={10}
                          disabled={step === "sending"}
                        />
                      </div>
                      {error && <p className="text-center text-sm text-destructive font-medium">{error}</p>}
                      <Button
                        size="lg"
                        className="h-16 w-full text-lg gap-2"
                        onClick={handleSendOtp}
                        disabled={step === "sending"}
                      >
                        {step === "sending" ? (
                          <><Loader2 className="h-5 w-5 animate-spin" />{t("sendingOtp")}</>
                        ) : (
                          <>{t("sendOtp")}</>
                        )}
                      </Button>
                    </>
                  )}

                  {(step === "otp" || step === "verifying") && (
                    <>
                      <p className="text-center text-sm text-muted-foreground">
                        {t("otpSentTo")} <span className="font-bold text-foreground">{mobile}</span>
                      </p>
                      <div className="rounded-lg border-2 border-dashed border-kiosk-pending/50 bg-kiosk-pending/5 p-3 text-center">
                        <span className="text-xs text-muted-foreground">{t("demoOtp")}: </span>
                        <span className="font-mono text-xl font-extrabold text-kiosk-pending">{generatedOtp}</span>
                      </div>
                      <div className="relative">
                        <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                          placeholder={t("enterOtp")}
                          className="h-16 pl-12 text-xl tracking-[0.5em] text-center"
                          maxLength={4}
                          disabled={step === "verifying"}
                        />
                      </div>
                      {error && <p className="text-center text-sm text-destructive font-medium">{error}</p>}
                      <Button
                        size="lg"
                        className="h-16 w-full text-lg gap-2"
                        onClick={handleVerifyOtp}
                        disabled={step === "verifying"}
                      >
                        {step === "verifying" ? (
                          <><Loader2 className="h-5 w-5 animate-spin" />{t("verifying")}</>
                        ) : (
                          <>{t("verifyOtp")}</>
                        )}
                      </Button>
                      <Button variant="ghost" size="lg" className="w-full text-base" onClick={() => { setStep("mobile"); setOtp(""); setError(""); }}>
                        {t("changeMobile")}
                      </Button>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <footer className="border-t border-border bg-muted/50 px-6 py-3 text-center text-xs text-muted-foreground">
        {t("securityFooter")}
      </footer>
    </div>
  );
};

export default Login;
