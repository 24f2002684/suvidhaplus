import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  mobileNumber: string;
  login: (mobile: string) => void;
  logout: () => void;
  sessionTimeLeft: number;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  mobileNumber: "",
  login: () => {},
  logout: () => {},
  sessionTimeLeft: 0,
});

const SESSION_DURATION = 120; // 2 minutes

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [sessionTimeLeft, setSessionTimeLeft] = useState(SESSION_DURATION);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setMobileNumber("");
    setSessionTimeLeft(SESSION_DURATION);
  }, []);

  const login = useCallback((mobile: string) => {
    setMobileNumber(mobile);
    setIsAuthenticated(true);
    setSessionTimeLeft(SESSION_DURATION);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      setSessionTimeLeft((prev) => {
        if (prev <= 1) {
          logout();
          return SESSION_DURATION;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated, logout]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, mobileNumber, login, logout, sessionTimeLeft }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
