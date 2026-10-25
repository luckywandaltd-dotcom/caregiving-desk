import { ProfilesView } from "@/components/care/profiles-view";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Care profiles",
  "Save optional names, emergency contacts, allergies, doctor details, and pharmacy details on this device only.",
  "/care/profiles",
);

export default function ProfilesPage() {
  return <ProfilesView />;
}
