"use client";

import { useMemo, useState, type FormEvent } from "react";
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
import { formatWhen, profileLabel } from "@/lib/care/model";
import type { NoteDraft } from "@/lib/care/validate";

const blank = (): NoteDraft => ({ profileId: "", title: "", body: "" });

export function NotesView() {
  const care = useCare();
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState<string | undefined>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const normalized = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      care.notes
        .filter((note) => {
          if (!normalized) return true;
          return `${note.title} ${note.body}`.toLowerCase().includes(normalized);
        })
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [care.notes, normalized],
  );

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const result = await care.saveNote(form, editing);
    if (!result.ok) {
      setErrors(result.errors);
      setStatus("");
      document.getElementById(Object.keys(result.errors)[0] ?? "")?.focus();
      return;
    }
    setForm(blank());
    setEditing(undefined);
    setErrors({});
    setStatus(editing ? "Note updated on this device." : "Note saved on this device.");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl leading-tight">Care notes</h1>
        <p className="mt-3 max-w-3xl text-muted">
          Write, edit, search, and delete notes on this device. Notes are not sent to
          Caregiving Desk.
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
        <h2 className="font-serif text-3xl">{editing ? "Edit note" : "New note"}</h2>
        <Status>{status}</Status>
        <Field id="title" label="Title (optional)" error={errors.title}>
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
        <Field id="body" label="Note" error={errors.body}>
          {(describedBy) => (
            <textarea
              id="body"
              className={fieldClass}
              rows={5}
              value={form.body}
              aria-invalid={Boolean(errors.body)}
              aria-describedby={describedBy}
              onChange={(event) => setForm({ ...form, body: event.target.value })}
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
            {editing ? "Save changes" : "Save note"}
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
      <Field id="note-search" label="Search notes">
        {(describedBy) => (
          <input
            id="note-search"
            className={fieldClass}
            type="search"
            value={query}
            aria-describedby={describedBy}
            onChange={(event) => setQuery(event.target.value)}
          />
        )}
      </Field>
      <p role="status">
        {care.ready
          ? `${visible.length} ${visible.length === 1 ? "note" : "notes"}${normalized ? " match this search" : ""}.`
          : "Search is ready after records load."}
      </p>
      {care.ready && care.notes.length === 0 ? (
        <EmptyState title="No notes yet">
          <p>A title, a few sentences, or both are enough.</p>
        </EmptyState>
      ) : null}
      {care.ready && care.notes.length > 0 && visible.length === 0 ? (
        <EmptyState title="No notes match">
          <p>Try a different word, or clear the search to see every note.</p>
        </EmptyState>
      ) : null}
      <ul className="space-y-4">
        {visible.map((note) => {
          const profile = care.profiles.find((item) => item.id === note.profileId);
          return (
            <li key={note.id} className="rounded-2xl border border-border bg-paper p-5">
              <h2 className="font-serif text-2xl">{note.title || "Untitled note"}</h2>
              {profile ? <p className="mt-2">{profileLabel(profile)}</p> : null}
              {note.body ? <p className="mt-3 whitespace-pre-wrap">{note.body}</p> : null}
              <p className="mt-2 text-muted">Updated {formatWhen(note.updatedAt)}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  className={actionClass()}
                  onClick={() => {
                    setEditing(note.id);
                    setForm({
                      profileId: note.profileId,
                      title: note.title,
                      body: note.body,
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
                  onClick={() => setPendingDelete(note.id)}
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
        title="Delete this note?"
        confirmLabel="Delete note"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) void care.removeNote(pendingDelete);
          if (editing === pendingDelete) {
            setEditing(undefined);
            setForm(blank());
          }
          setPendingDelete(null);
          setStatus("Note deleted from this device.");
        }}
      >
        <p>This cannot be undone unless you already exported a copy.</p>
      </ConfirmDialog>
    </div>
  );
}
