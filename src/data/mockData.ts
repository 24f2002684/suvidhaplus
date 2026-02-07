export type ServiceType = "electricity" | "water" | "gas";

export interface BillData {
  consumerNumber: string;
  consumerName: string;
  billingPeriod: string;
  unitsConsumed: number;
  connectionCharge: number;
  meterRent: number;
  amountDue: number;
  dueDate: string;
}

export interface ComplaintStatus {
  id: string;
  service: ServiceType;
  type: string;
  description: string;
  status: "pending" | "in_progress" | "resolved";
  filedDate: string;
  expectedResolution?: string;
  resolvedDate?: string;
  resolutionSummary?: string;
  officerName?: string;
}

const billDatabase: Record<string, Record<ServiceType, BillData>> = {
  "1001234567": {
    electricity: {
      consumerNumber: "1001234567",
      consumerName: "Rajesh Kumar",
      billingPeriod: "Jan 2026 - Feb 2026",
      unitsConsumed: 342,
      connectionCharge: 150,
      meterRent: 25,
      amountDue: 2847,
      dueDate: "2026-02-28",
    },
    water: {
      consumerNumber: "1001234567",
      consumerName: "Rajesh Kumar",
      billingPeriod: "Jan 2026 - Feb 2026",
      unitsConsumed: 18,
      connectionCharge: 100,
      meterRent: 15,
      amountDue: 685,
      dueDate: "2026-02-28",
    },
    gas: {
      consumerNumber: "1001234567",
      consumerName: "Rajesh Kumar",
      billingPeriod: "Jan 2026 - Feb 2026",
      unitsConsumed: 12,
      connectionCharge: 75,
      meterRent: 20,
      amountDue: 520,
      dueDate: "2026-02-28",
    },
  },
  "2005678901": {
    electricity: {
      consumerNumber: "2005678901",
      consumerName: "Priya Sharma",
      billingPeriod: "Jan 2026 - Feb 2026",
      unitsConsumed: 210,
      connectionCharge: 150,
      meterRent: 25,
      amountDue: 1875,
      dueDate: "2026-02-28",
    },
    water: {
      consumerNumber: "2005678901",
      consumerName: "Priya Sharma",
      billingPeriod: "Jan 2026 - Feb 2026",
      unitsConsumed: 14,
      connectionCharge: 100,
      meterRent: 15,
      amountDue: 495,
      dueDate: "2026-02-28",
    },
    gas: {
      consumerNumber: "2005678901",
      consumerName: "Priya Sharma",
      billingPeriod: "Jan 2026 - Feb 2026",
      unitsConsumed: 8,
      connectionCharge: 75,
      meterRent: 20,
      amountDue: 380,
      dueDate: "2026-02-28",
    },
  },
};

export function lookupBill(consumerNumber: string, service: ServiceType): BillData | null {
  return billDatabase[consumerNumber]?.[service] || null;
}

const complaintDatabase: Record<string, ComplaintStatus> = {
  "CMP-2026-00418": {
    id: "CMP-2026-00418",
    service: "electricity",
    type: "No Supply",
    description: "Power outage in Sector 14 since morning",
    status: "pending",
    filedDate: "2026-02-05",
    expectedResolution: "2026-02-08",
  },
  "CMP-2026-00419": {
    id: "CMP-2026-00419",
    service: "water",
    type: "Leakage",
    description: "Water pipe leaking near Block C entrance",
    status: "in_progress",
    filedDate: "2026-02-03",
    expectedResolution: "2026-02-07",
    officerName: "Suresh Patel",
  },
  "CMP-2026-00420": {
    id: "CMP-2026-00420",
    service: "gas",
    type: "Billing Issue",
    description: "Incorrect meter reading shown in last bill",
    status: "resolved",
    filedDate: "2026-01-28",
    resolvedDate: "2026-02-01",
    resolutionSummary: "Meter re-read. Corrected bill issued with ₹240 credit applied.",
  },
};

let complaintCounter = 421;

export function lookupComplaint(id: string): ComplaintStatus | null {
  return complaintDatabase[id.toUpperCase()] || null;
}

export function submitComplaint(service: ServiceType, type: string, description: string): string {
  const id = `CMP-2026-${String(complaintCounter++).padStart(5, "0")}`;
  complaintDatabase[id] = {
    id,
    service,
    type,
    description,
    status: "pending",
    filedDate: new Date().toISOString().split("T")[0],
    expectedResolution: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
  };
  return id;
}

export function generateTransactionId(): string {
  return `TXN${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

export const adminData = {
  totalComplaints: 1247,
  paymentsToday: 89340,
  activeKiosks: 42,
  pendingComplaints: 186,
  complaintsByService: [
    { service: "Electricity", count: 520 },
    { service: "Water", count: 412 },
    { service: "Gas", count: 315 },
  ],
  paymentsOverTime: [
    { day: "Mon", amount: 12400 },
    { day: "Tue", amount: 15800 },
    { day: "Wed", amount: 11200 },
    { day: "Thu", amount: 18600 },
    { day: "Fri", amount: 14300 },
    { day: "Sat", amount: 9800 },
    { day: "Sun", amount: 7240 },
  ],
};

export const complaintTypes: Record<ServiceType, string[]> = {
  electricity: ["noSupply", "billingIssue", "meterFault", "other"],
  water: ["noSupply", "billingIssue", "leakage", "lowPressure", "other"],
  gas: ["noSupply", "billingIssue", "leakage", "other"],
};
