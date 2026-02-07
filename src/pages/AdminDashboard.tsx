import React from "react";
import { motion } from "framer-motion";
import { FileText, CreditCard, Monitor, AlertTriangle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/i18n/LanguageContext";
import { adminData } from "@/data/mockData";
import { KioskLayout } from "@/components/KioskLayout";

const statCards = [
  { key: "totalComplaints", icon: FileText, value: adminData.totalComplaints, colorVar: "var(--kiosk-complaint)" },
  { key: "paymentsToday", icon: CreditCard, value: `₹${adminData.paymentsToday.toLocaleString()}`, colorVar: "var(--kiosk-electricity)" },
  { key: "activeKiosks", icon: Monitor, value: adminData.activeKiosks, colorVar: "var(--kiosk-track)" },
  { key: "pendingComplaints", icon: AlertTriangle, value: adminData.pendingComplaints, colorVar: "var(--kiosk-pending)" },
];

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <KioskLayout showBack title={t("adminDashboard")}>
      <div className="space-y-8">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card>
                  <CardContent className="flex flex-col items-center gap-3 pt-6">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `hsl(${stat.colorVar})` }}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-extrabold text-foreground">{stat.value}</span>
                    <span className="text-sm text-muted-foreground text-center">{t(stat.key)}</span>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("complaintsByService")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={adminData.complaintsByService}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="service" className="text-sm" />
                  <YAxis className="text-sm" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("paymentsOverTime")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={adminData.paymentsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="day" className="text-sm" />
                  <YAxis className="text-sm" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "hsl(var(--secondary))" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </KioskLayout>
  );
};

export default AdminDashboard;
