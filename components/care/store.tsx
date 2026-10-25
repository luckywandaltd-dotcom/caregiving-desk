"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearRecords,
  deleteProfileAndUnlink,
  deleteRecord,
  loadRecords,
  putRecord,
  writeRecords,
} from "@/lib/care/db";
import {
  EXPORT_FORMAT,
  EXPORT_VERSION,
  createId,
  type Appointment,
  type CareExport,
  type CareRecords,
  type Medication,
  type Note,
  type Profile,
  type Task,
} from "@/lib/care/model";
import {
  validateAppointment,
  validateMedication,
  validateNote,
  validateProfile,
  validateTask,
  type AppointmentDraft,
  type FieldErrors,
  type MedicationDraft,
  type NoteDraft,
  type ProfileDraft,
  type TaskDraft,
} from "@/lib/care/validate";

type SaveResult = { ok: true } | { ok: false; errors: FieldErrors };

type CareContextValue = CareRecords & {
  ready: boolean;
  error: string | null;
  saveProfile: (draft: ProfileDraft, id?: string) => Promise<SaveResult>;
  removeProfile: (id: string) => Promise<void>;
  saveMedication: (draft: MedicationDraft, id?: string) => Promise<SaveResult>;
  removeMedication: (id: string) => Promise<void>;
  saveAppointment: (draft: AppointmentDraft, id?: string) => Promise<SaveResult>;
  removeAppointment: (id: string) => Promise<void>;
  saveTask: (draft: TaskDraft, id?: string) => Promise<SaveResult>;
  removeTask: (id: string) => Promise<void>;
  saveNote: (draft: NoteDraft, id?: string) => Promise<SaveResult>;
  removeNote: (id: string) => Promise<void>;
  exportRecords: () => CareExport;
  importRecords: (data: CareExport, mode: "merge" | "replace") => Promise<void>;
  deleteAll: () => Promise<void>;
};

const CareContext = createContext<CareContextValue | null>(null);

const empty: CareRecords = {
  profiles: [],
  medications: [],
  appointments: [],
  tasks: [],
  notes: [],
};

function upsert<T extends { id: string }>(items: T[], record: T) {
  const index = items.findIndex((item) => item.id === record.id);
  if (index === -1) return [record, ...items];
  const next = items.slice();
  next[index] = record;
  return next;
}

function stamp(existing: { createdAt: string } | undefined) {
  const now = new Date().toISOString();
  return { createdAt: existing?.createdAt ?? now, updatedAt: now };
}

export function CareProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<CareRecords>(empty);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadRecords()
      .then((loaded) => {
        if (cancelled) return;
        setRecords(loaded);
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setError(
          "This browser did not open on-device storage. Records cannot be saved in this window. Try a regular browser window, not a private one that blocks storage.",
        );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<CareContextValue>(() => {
    async function saveProfile(draft: ProfileDraft, id?: string): Promise<SaveResult> {
      const parsed = validateProfile(draft);
      if (!parsed.ok) return parsed;
      const existing = records.profiles.find((item) => item.id === id);
      const record: Profile = {
        ...parsed.value,
        id: id ?? createId(),
        ...stamp(existing),
      };
      await putRecord("profiles", record);
      setRecords((current) => ({
        ...current,
        profiles: upsert(current.profiles, record),
      }));
      return { ok: true };
    }

    async function saveMedication(
      draft: MedicationDraft,
      id?: string,
    ): Promise<SaveResult> {
      const parsed = validateMedication(draft);
      if (!parsed.ok) return parsed;
      const existing = records.medications.find((item) => item.id === id);
      const record: Medication = {
        ...parsed.value,
        id: id ?? createId(),
        ...stamp(existing),
      };
      await putRecord("medications", record);
      setRecords((current) => ({
        ...current,
        medications: upsert(current.medications, record),
      }));
      return { ok: true };
    }

    async function saveAppointment(
      draft: AppointmentDraft,
      id?: string,
    ): Promise<SaveResult> {
      const parsed = validateAppointment(draft);
      if (!parsed.ok) return parsed;
      const existing = records.appointments.find((item) => item.id === id);
      const record: Appointment = {
        ...parsed.value,
        id: id ?? createId(),
        ...stamp(existing),
      };
      await putRecord("appointments", record);
      setRecords((current) => ({
        ...current,
        appointments: upsert(current.appointments, record),
      }));
      return { ok: true };
    }

    async function saveTask(draft: TaskDraft, id?: string): Promise<SaveResult> {
      const parsed = validateTask(draft);
      if (!parsed.ok) return parsed;
      const existing = records.tasks.find((item) => item.id === id);
      const record: Task = {
        ...parsed.value,
        id: id ?? createId(),
        completedAt: parsed.value.completed
          ? existing?.completed
            ? existing.completedAt || new Date().toISOString()
            : new Date().toISOString()
          : "",
        ...stamp(existing),
      };
      await putRecord("tasks", record);
      setRecords((current) => ({ ...current, tasks: upsert(current.tasks, record) }));
      return { ok: true };
    }

    async function saveNote(draft: NoteDraft, id?: string): Promise<SaveResult> {
      const parsed = validateNote(draft);
      if (!parsed.ok) return parsed;
      const existing = records.notes.find((item) => item.id === id);
      const record: Note = { ...parsed.value, id: id ?? createId(), ...stamp(existing) };
      await putRecord("notes", record);
      setRecords((current) => ({ ...current, notes: upsert(current.notes, record) }));
      return { ok: true };
    }

    return {
      ...records,
      ready,
      error,
      saveProfile,
      saveMedication,
      saveAppointment,
      saveTask,
      saveNote,
      removeProfile: async (id: string) => {
        await deleteProfileAndUnlink(id);
        setRecords((current) => ({
          profiles: current.profiles.filter((item) => item.id !== id),
          medications: current.medications.map((item) =>
            item.profileId === id ? { ...item, profileId: "" } : item,
          ),
          appointments: current.appointments.map((item) =>
            item.profileId === id ? { ...item, profileId: "" } : item,
          ),
          tasks: current.tasks.map((item) =>
            item.profileId === id ? { ...item, profileId: "" } : item,
          ),
          notes: current.notes.map((item) =>
            item.profileId === id ? { ...item, profileId: "" } : item,
          ),
        }));
      },
      removeMedication: async (id: string) => {
        await deleteRecord("medications", id);
        setRecords((current) => ({
          ...current,
          medications: current.medications.filter((item) => item.id !== id),
        }));
      },
      removeAppointment: async (id: string) => {
        await deleteRecord("appointments", id);
        setRecords((current) => ({
          ...current,
          appointments: current.appointments.filter((item) => item.id !== id),
        }));
      },
      removeTask: async (id: string) => {
        await deleteRecord("tasks", id);
        setRecords((current) => ({
          ...current,
          tasks: current.tasks.filter((item) => item.id !== id),
        }));
      },
      removeNote: async (id: string) => {
        await deleteRecord("notes", id);
        setRecords((current) => ({
          ...current,
          notes: current.notes.filter((item) => item.id !== id),
        }));
      },
      exportRecords: () => ({
        format: EXPORT_FORMAT,
        version: EXPORT_VERSION,
        exportedAt: new Date().toISOString(),
        ...records,
      }),
      importRecords: async (data: CareExport, mode: "merge" | "replace") => {
        await writeRecords(data, mode);
        setRecords(await loadRecords());
      },
      deleteAll: async () => {
        await clearRecords();
        setRecords(empty);
      },
    };
  }, [error, ready, records]);

  return <CareContext.Provider value={value}>{children}</CareContext.Provider>;
}

export function useCare() {
  const value = useContext(CareContext);
  if (!value) throw new Error("The care desk is unavailable outside its pages.");
  return value;
}
