import { AppointmentsView } from "@/components/care/appointments-view";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Appointment planner",
  "Plan care appointments with dates, locations, questions to ask, and notes stored only on this device.",
  "/care/appointments",
);

export default function AppointmentsPage() {
  return <AppointmentsView />;
}
