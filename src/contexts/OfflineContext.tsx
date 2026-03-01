import React, { createContext, useContext, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface OfflineContextType {
  isOffline: boolean;
  toggleOffline: () => void;
  pendingCount: number;
  addPendingRequest: (data: Record<string, unknown>) => void;
}

const OfflineContext = createContext<OfflineContextType>({
  isOffline: false,
  toggleOffline: () => {},
  pendingCount: 0,
  addPendingRequest: () => {},
});

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const { toast } = useToast();

  const addPendingRequest = useCallback((data: Record<string, unknown>) => {
    if (isOffline) {
      const existing = JSON.parse(localStorage.getItem("suvidha_pending") || "[]");
      existing.push({ ...data, timestamp: Date.now() });
      localStorage.setItem("suvidha_pending", JSON.stringify(existing));
      setPendingCount(existing.length);
    }
  }, [isOffline]);

  const toggleOffline = useCallback(() => {
    setIsOffline((prev) => {
      if (prev) {
        // Going online — sync
        const pending = JSON.parse(localStorage.getItem("suvidha_pending") || "[]");
        if (pending.length > 0) {
          localStorage.removeItem("suvidha_pending");
          setPendingCount(0);
          toast({
            title: "✅ Synced Successfully",
            description: `${pending.length} pending request(s) synced.`,
          });
        }
        return false;
      }
      return true;
    });
  }, [toast]);

  return (
    <OfflineContext.Provider value={{ isOffline, toggleOffline, pendingCount, addPendingRequest }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => useContext(OfflineContext);
