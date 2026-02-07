import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Droplets, Flame, FileText, Search } from "lucide-react";
import { KioskLayout } from "@/components/KioskLayout";
import { useLanguage } from "@/i18n/LanguageContext";

const services = [
  { key: "electricityBill", icon: Zap, path: "/bill/electricity", colorVar: "var(--kiosk-electricity)" },
  { key: "waterBill", icon: Droplets, path: "/bill/water", colorVar: "var(--kiosk-water)" },
  { key: "gasService", icon: Flame, path: "/bill/gas", colorVar: "var(--kiosk-gas)" },
  { key: "lodgeComplaint", icon: FileText, path: "/complaint", colorVar: "var(--kiosk-complaint)" },
  { key: "trackApplication", icon: Search, path: "/track", colorVar: "var(--kiosk-track)" },
];

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <KioskLayout showBack={false}>
      <div className="flex flex-col items-center gap-10 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-muted-foreground">
            {t("tagline")}
          </h2>
        </div>

        <div className="grid w-full grid-cols-2 gap-5 sm:grid-cols-3">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.button
                key={service.key}
                onClick={() => navigate(service.path)}
                className="group flex flex-col items-center gap-4 rounded-2xl border-2 border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-2xl transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `hsl(${service.colorVar})` }}
                >
                  <Icon className="h-10 w-10 text-white" strokeWidth={2.2} />
                </div>
                <span className="text-center text-lg font-bold text-card-foreground">
                  {t(service.key)}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </KioskLayout>
  );
};

export default Index;
