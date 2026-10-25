import { DashboardView } from "@/components/care/dashboard-view";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Today at the care desk",
  "See today’s appointments, due care tasks, and links across the on-device care desk. Records stay in this browser.",
  "/care",
);

export default function CareHomePage() {
  return <DashboardView />;
}
