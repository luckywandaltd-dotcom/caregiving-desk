import { MedicationsView } from "@/components/care/medications-view";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Medicines and supplements",
  "Record medicines, supplements, and label instructions you already have. The care desk never recommends a dose.",
  "/care/medications",
);

export default function MedicationsPage() {
  return <MedicationsView />;
}
