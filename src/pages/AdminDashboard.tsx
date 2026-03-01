import React from "react";
import { motion } from "framer-motion";
import { FileText, CreditCard, Monitor, AlertTriangle, Clock, CheckCircle2, Loader2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
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

const statusBreakdown = [
  { name: "Pending", value: 186, color: "hsl(var(--kiosk-pending))" },
  { name: "In Progress", value: 324, color: "hsl(var(--kiosk-progress))" },
  { name: "Resolved", value: 737, color: "hsl(var(--kiosk-success))" },
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
                <Card className="border-2 hover:shadow-md transition-shadow">
                  <CardContent className="flex flex-col items-center gap-3 pt-6">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `hsl(${stat.colorVar})` }}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <span className="text-3xl font-extrabold text-foreground">{stat.value}</span>
                    <span className="text-sm text-muted-foreground text-center">{t(stat.key)}</span>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Status breakdown cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { key: "pending", icon: Clock, count: 186, colorClass: "text-kiosk-pending", bgClass: "bg-kiosk-pending/10" },
            { key: "inProgress", icon: Loader2, count: 324, colorClass: "text-kiosk-progress", bgClass: "bg-kiosk-progress/10" },
            { key: "resolved", icon: CheckCircle2, count: 737, colorClass: "text-kiosk-success", bgClass: "bg-kiosk-success/10" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.key} className="border-2">
                <CardContent className="flex items-center gap-3 pt-6">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.bgClass}`}>
                    <Icon className={`h-5 w-5 ${item.colorClass}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-foreground">{item.count}</p>
                    <p className="text-sm text-muted-foreground">{t(item.key)}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>{t("complaintsByService")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={[...adminData.complaintsByService, { service: "Municipal", count: 210 }]}>
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

          <Card className="border-2">
            <CardHeader>
              <CardTitle>{t("statusBreakdown")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={statusBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {statusBreakdown.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2">
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
    </KioskLayout>
  );
};

export default AdminDashboard;
