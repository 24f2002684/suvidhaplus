import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Language } from "@/i18n/translations";

const languageLabels: Record<Language, string> = {
  en: "English",
  hi: "हिन्दी",
  ta: "தமிழ்",
};

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-5 w-5 text-primary-foreground/70" />
      <div className="flex rounded-lg bg-primary-foreground/10 p-1">
        {(Object.keys(languageLabels) as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              language === lang
                ? "bg-primary-foreground text-primary shadow-sm"
                : "text-primary-foreground/80 hover:text-primary-foreground"
            }`}
          >
            {languageLabels[lang]}
          </button>
        ))}
      </div>
    </div>
  );
};
