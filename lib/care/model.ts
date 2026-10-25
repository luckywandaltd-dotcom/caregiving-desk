export const DB_NAME = "caregiving-desk";
export const DB_VERSION = 1;
export const EXPORT_FORMAT = "caregiving-desk-care-export";
export const EXPORT_VERSION = 1;

export const STORE_NAMES = [
  "profiles",
  "medications",
  "appointments",
  "tasks",
  "notes",
] as const;

export type StoreName = (typeof STORE_NAMES)[number];
export type MedicationKind = "medicine" | "supplement" | "other";

export type EmergencyContact = {
  name: string;
  phone: string;
  relationship: string;
};

export type Profile = {
  id: string;
  name: string;
  relationship: string;
  emergencyContacts: EmergencyContact[];
  allergies: string;
  doctorName: string;
  doctorPhone: string;
  doctorClinic: string;
  pharmacyName: string;
  pharmacyPhone: string;
  pharmacyAddress: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type Medication = {
  id: string;
  profileId: string;
  name: string;
  kind: MedicationKind;
  instructions: string;
  scheduleNote: string;
  notes: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Appointment = {
  id: string;
  profileId: string;
  title: string;
  date: string;
  time: string;
  location: string;
  questions: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type Task = {
  id: string;
  profileId: string;
  title: string;
  details: string;
  dueDate: string;
  completed: boolean;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type Note = {
  id: string;
  profileId: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type CareRecords = {
  profiles: Profile[];
  medications: Medication[];
  appointments: Appointment[];
  tasks: Task[];
  notes: Note[];
};

export type CareExport = CareRecords & {
  format: typeof EXPORT_FORMAT;
  version: typeof EXPORT_VERSION;
  exportedAt: string;
};

export const LIMITS = {
  short: 120,
  medium: 300,
  long: 4000,
  contacts: 12,
  records: 500,
} as const;

export const MEDICATION_KINDS: { value: MedicationKind; label: string }[] = [
  { value: "medicine", label: "Medicine" },
  { value: "supplement", label: "Supplement" },
  { value: "other", label: "Other recorded item" },
];

export function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function localISODate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function profileLabel(profile: Pick<Profile, "name" | "relationship">) {
  const name = profile.name.trim();
  const relationship = profile.relationship.trim();
  if (name && relationship) return `${name} · ${relationship}`;
  if (name) return name;
  if (relationship) return relationship;
  return "Care profile";
}

export function kindLabel(kind: MedicationKind) {
  return MEDICATION_KINDS.find((item) => item.value === kind)?.label ?? "Recorded item";
}

export function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatDay(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return new Intl.DateTimeFormat(undefined, { dateStyle: "full" }).format(date);
}
