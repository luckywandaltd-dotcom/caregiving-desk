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
import { formatDay, localISODate, profileLabel } from "@/lib/care/model";
import type { AppointmentDraft } from "@/lib/care/validate";

const blank = (): AppointmentDraft => ({
  profileId: "",
  title: "",
  date: "",
  time: "",
  location: "",
  questions: "",
  notes: "",
});

export function AppointmentsView() {
  const care = useCare();
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState<string | undefined>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const today = care.ready ? localISODate() : "";
  const upcoming = care.appointments
    .filter((item) => !today || item.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  const past = care.appointments
    .filter((item) => today && item.date < today)
    .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const result = await care.saveAppointment(form, editing);
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
      editing
        ? "Appointment updated on this device."
        : "Appointment saved on this device.",
    );
  }

  function list(items: typeof upcoming, empty: string) {
    if (!care.ready) return null;
    if (items.length === 0) {
      return (
        <EmptyState title={empty}>
          <p>Add a title, date, location, and any questions you want to remember.</p>
        </EmptyState>
      );
    }
    return (
      <ul className="space-y-4">
        {items.map((item) => {
          const profile = care.profiles.find((entry) => entry.id === item.profileId);
          return (
            <li key={item.id} className="rounded-2xl border border-border bg-paper p-5">
              <h3 className="font-serif text-2xl">{item.title}</h3>
              <p className="mt-2 font-bold">
                {formatDay(item.date)}
                {item.time ? ` · ${item.time}` : ""}
              </p>
              {item.location ? <p>{item.location}</p> : null}
              {profile ? <p>{profileLabel(profile)}</p> : null}
              {item.questions ? (
                <p className="mt-3">
                  <span className="font-bold">Questions to ask: </span>
                  {item.questions}
                </p>
              ) : null}
              {item.notes ? <p className="mt-2">{item.notes}</p> : null}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  className={actionClass()}
                  onClick={() => {
                    setEditing(item.id);
                    setForm({
                      profileId: item.profileId,
                      title: item.title,
                      date: item.date,
                      time: item.time,
                      location: item.location,
                      questions: item.questions,
                      notes: item.notes,
                    });
                    setErrors({});
                    document.getElementById("title")?.focus();
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
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl leading-tight">Appointment planner</h1>
        <p className="mt-3 max-w-3xl text-muted">
          Keep dates, places, questions, and notes together. This planner does not book
          visits or contact a clinic.
        </p>
      </div>
      {care.error ? <p role="alert">{care.error}</p> : null}
      {!care.ready && !care.error ? (
        <p role="status">Loading records saved on this device.</p>
      ) : null}
      <form
        noValidate
        className="space-y-5 rounded-2xl border border-border bg-paper p-5 sm:p-6"
        onSubmit={onSubmit}
      >
        <h2 className="font-serif text-3xl">
          {editing ? "Edit appointment" : "Add an appointment"}
        </h2>
        <Status>{status}</Status>
        <Field id="title" label="Title" error={errors.title}>
          {(describedBy) => (
            <input
              id="title"
              className={fieldClass}
              value={form.title}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={describedBy}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />
          )}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="date" label="Date" error={errors.date}>
            {(describedBy) => (
              <input
                id="date"
                className={fieldClass}
                type="date"
                value={form.date}
                aria-invalid={Boolean(errors.date)}
                aria-describedby={describedBy}
                onChange={(event) => setForm({ ...form, date: event.target.value })}
              />
            )}
          </Field>
          <Field id="time" label="Time (optional)" error={errors.time}>
            {(describedBy) => (
              <input
                id="time"
                className={fieldClass}
                type="time"
                value={form.time}
                aria-invalid={Boolean(errors.time)}
                aria-describedby={describedBy}
                onChange={(event) => setForm({ ...form, time: event.target.value })}
              />
            )}
          </Field>
        </div>
        <Field id="location" label="Location" error={errors.location}>
          {(describedBy) => (
            <input
              id="location"
              className={fieldClass}
              value={form.location}
              aria-describedby={describedBy}
              onChange={(event) => setForm({ ...form, location: event.target.value })}
            />
          )}
        </Field>
        <Field id="questions" label="Questions to ask" error={errors.questions}>
          {(describedBy) => (
            <textarea
              id="questions"
              className={fieldClass}
              rows={4}
              value={form.questions}
              aria-describedby={describedBy}
              onChange={(event) => setForm({ ...form, questions: event.target.value })}
            />
          )}
        </Field>
        <Field id="notes" label="Notes" error={errors.notes}>
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
              profiles={care.profiles}
              value={form.profileId}
              describedBy={describedBy}
              onChange={(profileId) => setForm({ ...form, profileId })}
            />
          )}
        </Field>
        <div className="flex flex-wrap gap-3">
          <button type="submit" className={actionClass(true)}>
            {editing ? "Save changes" : "Save appointment"}
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
      <section className="space-y-4" aria-labelledby="upcoming-appointments">
        <h2 id="upcoming-appointments" className="font-serif text-3xl">
          Upcoming
        </h2>
        {list(upcoming, "No upcoming appointments")}
      </section>
      <section className="space-y-4" aria-labelledby="past-appointments">
        <h2 id="past-appointments" className="font-serif text-3xl">
          Earlier dates
        </h2>
        {list(past, "No earlier appointments")}
      </section>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Remove this appointment?"
        confirmLabel="Remove appointment"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) void care.removeAppointment(pendingDelete);
          if (editing === pendingDelete) {
            setEditing(undefined);
            setForm(blank());
          }
          setPendingDelete(null);
          setStatus("Appointment removed from this device.");
        }}
      >
        <p>The visit itself is not cancelled. This only removes the note saved here.</p>
      </ConfirmDialog>
    </div>
  );
}
