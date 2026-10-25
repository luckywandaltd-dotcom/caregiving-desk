import { NotesView } from "@/components/care/notes-view";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Care notes",
  "Create, edit, search, and delete caregiving notes saved on this device. Notes are not uploaded.",
  "/care/notes",
);

export default function NotesPage() {
  return <NotesView />;
}
