import {
  EXPORT_FORMAT,
  EXPORT_VERSION,
  LIMITS,
  type Appointment,
  type CareExport,
  type EmergencyContact,
  type Medication,
  type MedicationKind,
  type Note,
  type Profile,
  type Task,
} from "@/lib/care/model";

export type FieldErrors = Record<string, string>;

type Result<T> = { ok: true; value: T } | { ok: false; errors: FieldErrors };

function text(value: unknown, max: number) {
  if (typeof value !== "string") return { ok: false as const };
  const trimmed = value.trim();
  if (trimmed.length > max) return { ok: false as const, tooLong: true as const };
  return { ok: true as const, value: trimmed };
}

function requireText(value: unknown, max: number, label: string): Result<string> {
  const parsed = text(value, max);
  if (!parsed.ok) {
    return {
      ok: false,
      errors: {
        value: parsed.tooLong
          ? `${label} must be ${max} characters or fewer.`
          : `Enter ${label.toLowerCase()}.`,
      },
    };
  }
  if (!parsed.value) {
    return { ok: false, errors: { value: `Enter ${label.toLowerCase()}.` } };
  }
  return { ok: true, value: parsed.value };
}

function optionalText(value: unknown, max: number, label: string): Result<string> {
  if (value == null) return { ok: true, value: "" };
  const parsed = text(value, max);
  if (!parsed.ok) {
    return {
      ok: false,
      errors: {
        value: parsed.tooLong
          ? `${label} must be ${max} characters or fewer.`
          : `${label} must be text.`,
      },
    };
  }
  return { ok: true, value: parsed.value };
}

function apply(
  errors: FieldErrors,
  key: string,
  result: Result<string>,
): string | undefined {
  if (!result.ok) {
    errors[key] = result.errors.value ?? "Check this field.";
    return undefined;
  }
  return result.value;
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

function validDate(value: string) {
  if (!datePattern.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
  );
}

function optionalDate(value: unknown, label: string, required: boolean): Result<string> {
  const parsed = optionalText(value, 10, label);
  if (!parsed.ok) return parsed;
  if (!parsed.value) {
    return required
      ? { ok: false, errors: { value: `Choose ${label.toLowerCase()}.` } }
      : { ok: true, value: "" };
  }
  if (!validDate(parsed.value)) {
    return { ok: false, errors: { value: `Choose a real ${label.toLowerCase()}.` } };
  }
  return parsed;
}

function optionalTime(value: unknown): Result<string> {
  const parsed = optionalText(value, 5, "Time");
  if (!parsed.ok) return parsed;
  if (parsed.value && !timePattern.test(parsed.value)) {
    return { ok: false, errors: { value: "Enter a time like 09:30." } };
  }
  return parsed;
}

export type ProfileDraft = Omit<Profile, "id" | "createdAt" | "updatedAt">;
export type MedicationDraft = Omit<Medication, "id" | "createdAt" | "updatedAt">;
export type AppointmentDraft = Omit<Appointment, "id" | "createdAt" | "updatedAt">;
export type TaskDraft = Omit<Task, "id" | "createdAt" | "updatedAt" | "completedAt"> & {
  completed: boolean;
};
export type NoteDraft = Omit<Note, "id" | "createdAt" | "updatedAt">;

function contacts(value: unknown): Result<EmergencyContact[]> {
  if (value == null) return { ok: true, value: [] };
  if (!Array.isArray(value)) {
    return {
      ok: false,
      errors: { emergencyContacts: "Emergency contacts must be a list." },
    };
  }
  if (value.length > LIMITS.contacts) {
    return {
      ok: false,
      errors: {
        emergencyContacts: `Use ${LIMITS.contacts} emergency contacts or fewer.`,
      },
    };
  }
  const errors: FieldErrors = {};
  const next: EmergencyContact[] = [];
  value.forEach((item, index) => {
    if (!item || typeof item !== "object") {
      errors[`contact-${index}-name`] = "Check this emergency contact.";
      return;
    }
    const record = item as Record<string, unknown>;
    const name = optionalText(record.name ?? "", LIMITS.short, "Contact name");
    const phone = optionalText(record.phone ?? "", LIMITS.short, "Contact phone");
    const relationship = optionalText(
      record.relationship ?? "",
      LIMITS.short,
      "Contact relationship",
    );
    const nameValue = name.ok ? name.value : "";
    const phoneValue = phone.ok ? phone.value : "";
    const relationshipValue = relationship.ok ? relationship.value : "";
    if (!name.ok)
      errors[`contact-${index}-name`] = name.errors.value ?? "Check the name.";
    if (!phone.ok)
      errors[`contact-${index}-phone`] = phone.errors.value ?? "Check the phone.";
    if (!relationship.ok) {
      errors[`contact-${index}-relationship`] =
        relationship.errors.value ?? "Check the relationship.";
    }
    if (!nameValue && !phoneValue && !relationshipValue) return;
    if (name.ok && phone.ok && relationship.ok && !nameValue && !phoneValue) {
      errors[`contact-${index}-name`] = "Enter a name or phone for this contact.";
    }
    next.push({
      name: nameValue,
      phone: phoneValue,
      relationship: relationshipValue,
    });
  });
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value: next };
}

export function validateProfile(input: ProfileDraft): Result<ProfileDraft> {
  const errors: FieldErrors = {};
  const name = apply(errors, "name", optionalText(input.name, LIMITS.short, "Name"));
  const relationship = apply(
    errors,
    "relationship",
    optionalText(input.relationship, LIMITS.short, "Relationship"),
  );
  const allergies = apply(
    errors,
    "allergies",
    optionalText(input.allergies, LIMITS.long, "Allergies"),
  );
  const doctorName = apply(
    errors,
    "doctorName",
    optionalText(input.doctorName, LIMITS.short, "Doctor name"),
  );
  const doctorPhone = apply(
    errors,
    "doctorPhone",
    optionalText(input.doctorPhone, LIMITS.short, "Doctor phone"),
  );
  const doctorClinic = apply(
    errors,
    "doctorClinic",
    optionalText(input.doctorClinic, LIMITS.medium, "Clinic"),
  );
  const pharmacyName = apply(
    errors,
    "pharmacyName",
    optionalText(input.pharmacyName, LIMITS.short, "Pharmacy name"),
  );
  const pharmacyPhone = apply(
    errors,
    "pharmacyPhone",
    optionalText(input.pharmacyPhone, LIMITS.short, "Pharmacy phone"),
  );
  const pharmacyAddress = apply(
    errors,
    "pharmacyAddress",
    optionalText(input.pharmacyAddress, LIMITS.medium, "Pharmacy address"),
  );
  const notes = apply(errors, "notes", optionalText(input.notes, LIMITS.long, "Notes"));
  const people = contacts(input.emergencyContacts);
  if (!people.ok) Object.assign(errors, people.errors);
  if (Object.keys(errors).length || !people.ok) return { ok: false, errors };
  return {
    ok: true,
    value: {
      name: name ?? "",
      relationship: relationship ?? "",
      emergencyContacts: people.value,
      allergies: allergies ?? "",
      doctorName: doctorName ?? "",
      doctorPhone: doctorPhone ?? "",
      doctorClinic: doctorClinic ?? "",
      pharmacyName: pharmacyName ?? "",
      pharmacyPhone: pharmacyPhone ?? "",
      pharmacyAddress: pharmacyAddress ?? "",
      notes: notes ?? "",
    },
  };
}

export function validateMedication(input: MedicationDraft): Result<MedicationDraft> {
  const errors: FieldErrors = {};
  const name = apply(errors, "name", requireText(input.name, LIMITS.short, "A name"));
  const kind: MedicationKind | undefined =
    input.kind === "medicine" || input.kind === "supplement" || input.kind === "other"
      ? input.kind
      : undefined;
  if (!kind) errors.kind = "Choose medicine, supplement, or other.";
  const instructions = apply(
    errors,
    "instructions",
    optionalText(input.instructions, LIMITS.long, "Instructions"),
  );
  const scheduleNote = apply(
    errors,
    "scheduleNote",
    optionalText(input.scheduleNote, LIMITS.medium, "Schedule note"),
  );
  const notes = apply(errors, "notes", optionalText(input.notes, LIMITS.long, "Notes"));
  const profileId = apply(
    errors,
    "profileId",
    optionalText(input.profileId, LIMITS.short, "Profile"),
  );
  if (typeof input.active !== "boolean")
    errors.active = "Choose whether this is current.";
  if (Object.keys(errors).length || !kind) return { ok: false, errors };
  return {
    ok: true,
    value: {
      profileId: profileId ?? "",
      name: name ?? "",
      kind,
      instructions: instructions ?? "",
      scheduleNote: scheduleNote ?? "",
      notes: notes ?? "",
      active: input.active,
    },
  };
}

export function validateAppointment(input: AppointmentDraft): Result<AppointmentDraft> {
  const errors: FieldErrors = {};
  const title = apply(errors, "title", requireText(input.title, LIMITS.short, "A title"));
  const date = apply(errors, "date", optionalDate(input.date, "Date", true));
  const time = apply(errors, "time", optionalTime(input.time));
  const location = apply(
    errors,
    "location",
    optionalText(input.location, LIMITS.medium, "Location"),
  );
  const questions = apply(
    errors,
    "questions",
    optionalText(input.questions, LIMITS.long, "Questions"),
  );
  const notes = apply(errors, "notes", optionalText(input.notes, LIMITS.long, "Notes"));
  const profileId = apply(
    errors,
    "profileId",
    optionalText(input.profileId, LIMITS.short, "Profile"),
  );
  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      profileId: profileId ?? "",
      title: title ?? "",
      date: date ?? "",
      time: time ?? "",
      location: location ?? "",
      questions: questions ?? "",
      notes: notes ?? "",
    },
  };
}

export function validateTask(input: TaskDraft): Result<TaskDraft> {
  const errors: FieldErrors = {};
  const title = apply(errors, "title", requireText(input.title, LIMITS.short, "A task"));
  const details = apply(
    errors,
    "details",
    optionalText(input.details, LIMITS.long, "Details"),
  );
  const dueDate = apply(
    errors,
    "dueDate",
    optionalDate(input.dueDate, "Due date", false),
  );
  const profileId = apply(
    errors,
    "profileId",
    optionalText(input.profileId, LIMITS.short, "Profile"),
  );
  if (typeof input.completed !== "boolean")
    errors.completed = "Choose a completion status.";
  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      profileId: profileId ?? "",
      title: title ?? "",
      details: details ?? "",
      dueDate: dueDate ?? "",
      completed: input.completed,
    },
  };
}

export function validateNote(input: NoteDraft): Result<NoteDraft> {
  const errors: FieldErrors = {};
  const title = apply(errors, "title", optionalText(input.title, LIMITS.short, "Title"));
  const body = apply(errors, "body", optionalText(input.body, LIMITS.long, "Note"));
  const profileId = apply(
    errors,
    "profileId",
    optionalText(input.profileId, LIMITS.short, "Profile"),
  );
  if (title !== undefined && body !== undefined && !title && !body) {
    errors.body = "Enter a title or a note.";
  }
  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    value: { profileId: profileId ?? "", title: title ?? "", body: body ?? "" },
  };
}

function id(value: unknown) {
  return typeof value === "string" && /^[A-Za-z0-9_-]{8,80}$/.test(value);
}

function stamp(value: unknown) {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    return new Date().toISOString();
  }
  return value;
}

function parseList<T>(
  value: unknown,
  label: string,
  map: (item: unknown) => T | string,
): T[] | string {
  if (!Array.isArray(value)) return `${label} must be a list.`;
  if (value.length > LIMITS.records) {
    return `${label} has more than ${LIMITS.records} records. Split the file and try again.`;
  }
  const records: T[] = [];
  for (let index = 0; index < value.length; index += 1) {
    const parsed = map(value[index]);
    if (typeof parsed === "string") return `${label} item ${index + 1}: ${parsed}`;
    records.push(parsed);
  }
  return records;
}

function withIdentity<T extends { id: string; createdAt: string; updatedAt: string }>(
  item: unknown,
  build: (
    record: Record<string, unknown>,
  ) => Result<Omit<T, "id" | "createdAt" | "updatedAt">>,
): T | string {
  if (!item || typeof item !== "object") return "A record is missing.";
  const record = item as Record<string, unknown>;
  if (!id(record.id)) return "A record has an invalid id.";
  const built = build(record);
  if (!built.ok) return Object.values(built.errors)[0] ?? "A record is invalid.";
  return {
    ...built.value,
    id: record.id,
    createdAt: stamp(record.createdAt),
    updatedAt: stamp(record.updatedAt),
  } as T;
}

export function parseExport(
  raw: string,
): { ok: true; value: CareExport } | { ok: false; error: string } {
  if (raw.length > 2_000_000) {
    return { ok: false, error: "That file is too large to import on this device." };
  }
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return { ok: false, error: "That file is not valid JSON." };
  }
  if (!json || typeof json !== "object") {
    return { ok: false, error: "That file does not contain care records." };
  }
  const data = json as Record<string, unknown>;
  if (data.format !== EXPORT_FORMAT) {
    return {
      ok: false,
      error: "Choose a Caregiving Desk care-desk export. Other files are left unused.",
    };
  }
  if (data.version !== EXPORT_VERSION) {
    return { ok: false, error: "This export version is not supported." };
  }
  const profiles = parseList(data.profiles, "Profiles", (item) =>
    withIdentity<Profile>(item, (record) =>
      validateProfile({
        name: String(record.name ?? ""),
        relationship: String(record.relationship ?? ""),
        emergencyContacts: Array.isArray(record.emergencyContacts)
          ? (record.emergencyContacts as EmergencyContact[])
          : [],
        allergies: String(record.allergies ?? ""),
        doctorName: String(record.doctorName ?? ""),
        doctorPhone: String(record.doctorPhone ?? ""),
        doctorClinic: String(record.doctorClinic ?? ""),
        pharmacyName: String(record.pharmacyName ?? ""),
        pharmacyPhone: String(record.pharmacyPhone ?? ""),
        pharmacyAddress: String(record.pharmacyAddress ?? ""),
        notes: String(record.notes ?? ""),
      }),
    ),
  );
  if (typeof profiles === "string") return { ok: false, error: profiles };
  const medications = parseList(data.medications, "Medicines", (item) =>
    withIdentity<Medication>(item, (record) =>
      validateMedication({
        profileId: String(record.profileId ?? ""),
        name: String(record.name ?? ""),
        kind: record.kind as MedicationKind,
        instructions: String(record.instructions ?? ""),
        scheduleNote: String(record.scheduleNote ?? ""),
        notes: String(record.notes ?? ""),
        active: record.active !== false,
      }),
    ),
  );
  if (typeof medications === "string") return { ok: false, error: medications };
  const appointments = parseList(data.appointments, "Appointments", (item) =>
    withIdentity<Appointment>(item, (record) =>
      validateAppointment({
        profileId: String(record.profileId ?? ""),
        title: String(record.title ?? ""),
        date: String(record.date ?? ""),
        time: String(record.time ?? ""),
        location: String(record.location ?? ""),
        questions: String(record.questions ?? ""),
        notes: String(record.notes ?? ""),
      }),
    ),
  );
  if (typeof appointments === "string") return { ok: false, error: appointments };
  const tasks = parseList(data.tasks, "Tasks", (item) => {
    if (!item || typeof item !== "object") return "A record is missing.";
    const record = item as Record<string, unknown>;
    if (!id(record.id)) return "A record has an invalid id.";
    const built = validateTask({
      profileId: String(record.profileId ?? ""),
      title: String(record.title ?? ""),
      details: String(record.details ?? ""),
      dueDate: String(record.dueDate ?? ""),
      completed: record.completed === true,
    });
    if (!built.ok) return Object.values(built.errors)[0] ?? "A record is invalid.";
    return {
      ...built.value,
      id: record.id as string,
      completedAt:
        built.value.completed && typeof record.completedAt === "string"
          ? stamp(record.completedAt)
          : "",
      createdAt: stamp(record.createdAt),
      updatedAt: stamp(record.updatedAt),
    } satisfies Task;
  });
  if (typeof tasks === "string") return { ok: false, error: tasks };
  const notes = parseList(data.notes, "Notes", (item) =>
    withIdentity<Note>(item, (record) =>
      validateNote({
        profileId: String(record.profileId ?? ""),
        title: String(record.title ?? ""),
        body: String(record.body ?? ""),
      }),
    ),
  );
  if (typeof notes === "string") return { ok: false, error: notes };
  return {
    ok: true,
    value: {
      format: EXPORT_FORMAT,
      version: EXPORT_VERSION,
      exportedAt: stamp(data.exportedAt),
      profiles,
      medications,
      appointments,
      tasks,
      notes,
    },
  };
}
