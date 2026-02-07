import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/i18n/LanguageContext";

interface KioskLayoutProps {
  children: React.ReactNode;
  showBack?: boolean;
  title?: string;
}

export const KioskLayout: React.FC<KioskLayoutProps> = ({ children, showBack = true, title }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col bg-background">
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

        <LanguageSelector />
      </header>

      {/* Content */}
      <main className="flex flex-1 items-start justify-center overflow-y-auto p-6">
        <motion.div
          className="w-full max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};
