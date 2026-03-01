import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, WifiOff, Wifi, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useOffline } from "@/contexts/OfflineContext";
import { Switch } from "@/components/ui/switch";

interface KioskLayoutProps {
  children: React.ReactNode;
  showBack?: boolean;
  title?: string;
}

export const KioskLayout: React.FC<KioskLayoutProps> = ({ children, showBack = true, title }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { logout, sessionTimeLeft } = useAuth();
  const { isOffline, toggleOffline, pendingCount } = useOffline();

  const mins = Math.floor(sessionTimeLeft / 60);
  const secs = sessionTimeLeft % 60;
  const timeStr = `${mins}:${String(secs).padStart(2, "0")}`;
  const isLow = sessionTimeLeft <= 30;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Offline banner */}
      {isOffline && (
        <div className="flex items-center justify-center gap-2 bg-destructive px-4 py-2 text-destructive-foreground text-sm font-semibold">
          <WifiOff className="h-4 w-4" />
          {t("offlineBanner")}
          {pendingCount > 0 && <span className="ml-1">({pendingCount} {t("queued")})</span>}
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-primary px-6 py-4">
        <div className="flex items-center gap-4">
          {showBack && (
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate("/")}
              className="text-primary-foreground hover:bg-primary-foreground/10 gap-2 text-lg"
            >
              <ArrowLeft className="h-6 w-6" />
              {t("backToHome")}
            </Button>
          )}
          {!showBack && (
            <div className="flex items-baseline gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-primary-foreground">
                {t("appName")}
              </h1>
              <span className="hidden text-sm font-medium text-primary-foreground/70 sm:inline">
                {t("tagline")}
              </span>
            </div>
          )}
        </div>

        {title && showBack && (
          <h2 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold text-primary-foreground">
            {title}
          </h2>
        )}

        <div className="flex items-center gap-4">
          {/* Session timer */}
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${isLow ? "bg-destructive/20 text-destructive-foreground animate-pulse" : "bg-primary-foreground/10 text-primary-foreground"}`}>
            <Clock className="h-4 w-4" />
            {timeStr}
          </div>

          {/* Offline toggle */}
          <div className="flex items-center gap-2 text-primary-foreground">
            {isOffline ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
            <Switch checked={isOffline} onCheckedChange={toggleOffline} />
          </div>

          <LanguageSelector />

          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-primary-foreground hover:bg-primary-foreground/10"
            title={t("logout")}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex flex-1 items-start justify-center overflow-y-auto p-6">
        <motion.div
          className="w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      {/* Security footer */}
      <footer className="border-t border-border bg-muted/50 px-6 py-3 text-center text-xs text-muted-foreground">
        {t("securityFooter")}
      </footer>
    </div>
  );
};
