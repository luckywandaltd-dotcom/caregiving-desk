"use client";

import { useState, type FormEvent } from "react";
import { useCare } from "@/components/care/store";
import {
  ConfirmDialog,
  EmptyState,
  Field,
  ProfileSelect,
  Status,
  actionClass,
  fieldClass,
} from "@/components/care/ui";
import {
  MEDICATION_KINDS,
  formatWhen,
  kindLabel,
  profileLabel,
  type MedicationKind,
} from "@/lib/care/model";
import type { MedicationDraft } from "@/lib/care/validate";

const blank = (): MedicationDraft => ({
  profileId: "",
  name: "",
  kind: "medicine",
  instructions: "",
  scheduleNote: "",
  notes: "",
  active: true,
});

export function MedicationsView() {
  const { ready, error, medications, profiles, saveMedication, removeMedication } =
    useCare();
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState<string | undefined>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const sorted = [...medications].sort(
    (a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name),
  );

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const result = await saveMedication(form, editing);
    if (!result.ok) {
      setErrors(result.errors);
      setStatus("");
      document.getElementById(Object.keys(result.errors)[0] ?? "")?.focus();
      return;
    }
    setForm(blank());
    setEditing(undefined);
    setErrors({});
    setStatus(
      editing ? "Record updated on this device." : "Record saved on this device.",
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl leading-tight">Medicines and supplements</h1>
        <div
          className="mt-4 max-w-3xl space-y-3 rounded-2xl border border-border bg-sage p-5"
          role="note"
        >
          <p className="font-bold">
            Copy what you already have. This desk does not recommend a medicine,
            supplement, or dose.
          </p>
          <p>
            Write the name and the instructions already printed on the label, or the
            instructions your own doctor or pharmacist gave you. Do not use this list to
            start, stop, or change anything. Talk with your doctor or pharmacist about
            your care.
          </p>
        </div>
      </div>
      {error ? <p role="alert">{error}</p> : null}
      {!ready && !error ? (
        <p role="status">Loading records saved on this device.</p>
      ) : null}
      <form
        noValidate
        className="space-y-5 rounded-2xl border border-border bg-paper p-5 sm:p-6"
        onSubmit={onSubmit}
      >
        <h2 className="font-serif text-3xl">
          {editing ? "Edit a record" : "Add a record"}
        </h2>
        <Status>{status}</Status>
        <Field id="name" label="Name" error={errors.name}>
          {(describedBy) => (
            <input
              id="name"
              className={fieldClass}
              autoComplete="off"
              value={form.name}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describedBy}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
          )}
        </Field>
        <Field id="kind" label="What kind of record is this?" error={errors.kind}>
          {(describedBy) => (
            <select
              id="kind"
              className={`${fieldClass} min-h-12`}
              value={form.kind}
              aria-describedby={describedBy}
              onChange={(event) =>
                setForm({ ...form, kind: event.target.value as MedicationKind })
              }
            >
              {MEDICATION_KINDS.map((kind) => (
                <option key={kind.value} value={kind.value}>
                  {kind.label}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field
          id="instructions"
          label="Label or existing instructions"
          hint="Copy the words you already have. Leave this blank if you only want the name."
          error={errors.instructions}
        >
          {(describedBy) => (
            <textarea
              id="instructions"
              className={fieldClass}
              rows={4}
              value={form.instructions}
              aria-invalid={Boolean(errors.instructions)}
              aria-describedby={describedBy}
              onChange={(event) => setForm({ ...form, instructions: event.target.value })}
            />
          )}
        </Field>
        <Field
          id="scheduleNote"
          label="Your own schedule note"
          hint="Optional. For example, the time of day you already use. This is not a suggested schedule."
          error={errors.scheduleNote}
        >
          {(describedBy) => (
            <input
              id="scheduleNote"
              className={fieldClass}
              value={form.scheduleNote}
              aria-invalid={Boolean(errors.scheduleNote)}
              aria-describedby={describedBy}
              onChange={(event) => setForm({ ...form, scheduleNote: event.target.value })}
            />
          )}
        </Field>
        <Field id="notes" label="Other notes" error={errors.notes}>
          {(describedBy) => (
            <textarea
              id="notes"
              className={fieldClass}
              rows={3}
              value={form.notes}
              aria-describedby={describedBy}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
            />
          )}
        </Field>
        <Field id="profileId" label="Linked profile" error={errors.profileId}>
          {(describedBy) => (
            <ProfileSelect
              id="profileId"
              profiles={profiles}
              value={form.profileId}
              describedBy={describedBy}
              onChange={(profileId) => setForm({ ...form, profileId })}
            />
          )}
        </Field>
        <label className="flex min-h-12 items-center gap-3 font-bold" htmlFor="active">
          <input
            id="active"
            className="size-6"
            type="checkbox"
            checked={form.active}
            onChange={(event) => setForm({ ...form, active: event.target.checked })}
          />
          This is a current record
        </label>
        <div className="flex flex-wrap gap-3">
          <button type="submit" className={actionClass(true)}>
            {editing ? "Save changes" : "Save record"}
          </button>
          {editing ? (
            <button
              type="button"
              className={actionClass()}
              onClick={() => {
                setEditing(undefined);
                setForm(blank());
                setErrors({});
              }}
            >
              Cancel editing
            </button>
          ) : null}
        </div>
      </form>
      {ready && medications.length === 0 ? (
        <EmptyState title="No medicines or supplements recorded">
          <p>Add a name you already use. Nothing is suggested for you.</p>
        </EmptyState>
      ) : null}
      <ul className="space-y-4">
        {sorted.map((item) => {
          const profile = profiles.find((entry) => entry.id === item.profileId);
          return (
            <li key={item.id} className="rounded-2xl border border-border bg-paper p-5">
              <h2 className="font-serif text-2xl">{item.name}</h2>
              <p className="mt-2 font-bold">
                {kindLabel(item.kind)} ·{" "}
                {item.active ? "Current record" : "Not marked current"}
              </p>
              {profile ? <p>{profileLabel(profile)}</p> : null}
              {item.instructions ? (
                <p className="mt-3">
                  <span className="font-bold">Recorded instructions: </span>
                  {item.instructions}
                </p>
              ) : null}
              {item.scheduleNote ? (
                <p className="mt-2">
                  <span className="font-bold">Your schedule note: </span>
                  {item.scheduleNote}
                </p>
              ) : null}
              {item.notes ? <p className="mt-2">{item.notes}</p> : null}
              <p className="mt-2 text-muted">Updated {formatWhen(item.updatedAt)}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  className={actionClass()}
                  onClick={() => {
                    setEditing(item.id);
                    setForm({
                      profileId: item.profileId,
                      name: item.name,
                      kind: item.kind,
                      instructions: item.instructions,
                      scheduleNote: item.scheduleNote,
                      notes: item.notes,
                      active: item.active,
                    });
                    setErrors({});
                    document.getElementById("name")?.focus();
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className={actionClass()}
                  onClick={() => setPendingDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Remove this record?"
        confirmLabel="Remove record"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) void removeMedication(pendingDelete);
          if (editing === pendingDelete) {
            setEditing(undefined);
            setForm(blank());
          }
          setPendingDelete(null);
          setStatus("Record removed from this device.");
        }}
      >
        <p>
          This only deletes what was saved on this device. It does not change a
          prescription or a label.
        </p>
      </ConfirmDialog>
    </div>
  );
}
