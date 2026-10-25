import { DataView } from "@/components/care/data-view";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Care desk data",
  "Export, import, or delete care-desk records stored on this device. Nothing is backed up automatically.",
  "/care/data",
);

export default function DataPage() {
  return <DataView />;
}
