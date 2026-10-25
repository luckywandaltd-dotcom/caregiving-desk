import { ChecklistView } from "@/components/care/checklist-view";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Care checklist",
  "Keep everyday care tasks, optional due dates, and completion status in this browser.",
  "/care/checklist",
);

export default function ChecklistPage() {
  return <ChecklistView />;
}
