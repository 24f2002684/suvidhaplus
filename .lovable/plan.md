

# SUVIDHA+ — Smart Civic Service Kiosk

A modern, touchscreen-friendly web app simulating a public civic service kiosk for bill payments, complaint filing, and application tracking.

---

## 1. Home Screen
- Full-screen kiosk-style layout with the **SUVIDHA+** logo and branding at the top
- **Language selector** (English, Hindi, Tamil) in the header — switching language updates all UI labels
- **5 large, high-contrast service buttons** with icons arranged in a grid:
  - ⚡ Electricity Bill
  - 💧 Water Bill
  - 🔥 Gas Service
  - 📝 Lodge Complaint
  - 🔍 Track Application
- Clean, accessible design with large fonts and generous spacing for elderly users
- A "Back to Home" button visible on every sub-screen

---

## 2. Electricity Bill Payment Flow
A multi-step wizard:
1. **Enter Consumer Number** — input field with a "Search" button
2. **Bill Details** — displays mock data (consumer name, billing period, units consumed, amount due) in a clear card layout
3. **Pay Now** — confirmation screen with a simulated payment button
4. **Payment Success** — green confirmation banner with transaction ID, date, and amount
5. **Digital Receipt** — styled receipt card with all details and a "Print / Download" button (simulated)

*Water Bill and Gas Service will follow the same flow pattern with contextual labels.*

---

## 3. Complaint Submission Flow
Step-by-step form:
1. **Select Service** — choose between Electricity, Water, or Gas
2. **Select Complaint Type** — dropdown with options like "No Supply", "Billing Issue", "Meter Fault", "Leakage", etc.
3. **Description** — large text area for details
4. **Submit** — posts the complaint (mock)
5. **Confirmation Screen** — displays a generated Complaint ID (e.g., `CMP-2026-00421`) with a summary of the submission

---

## 4. Track Application
- **Input field** to enter a Complaint ID or Application ID
- **Search button** to look up status
- **Status display** showing one of three mock states with visual indicators:
  - 🟡 **Pending** — complaint received, awaiting assignment
  - 🔵 **In Progress** — assigned to a field officer with expected resolution date
  - 🟢 **Resolved** — completed with resolution summary
- A timeline/stepper visual showing progress through the stages

---

## 5. Admin Dashboard
A separate route (`/admin`) with:
- **Summary cards** at the top:
  - Total Complaints Filed
  - Payments Collected Today
  - Active Kiosks
  - Pending Complaints
- **Bar chart** — complaints by service type (Electricity, Water, Gas)
- **Line chart** — payments over the last 7 days
- Simple, clean layout using mock data — no authentication required

---

## 6. Design & UX
- **Kiosk-style layout**: centered content panels, no traditional browser navigation feel
- **High-contrast colors**: dark text on light backgrounds, prominent action buttons
- **Large touch targets**: minimum 48px buttons, generous padding
- **Accessible fonts**: 18px+ base size for readability
- **Smooth transitions** between screens with fade/slide animations
- **Consistent header** with SUVIDHA+ branding, language toggle, and back navigation
- All data is **mock/simulated** — no real APIs or payment processing

