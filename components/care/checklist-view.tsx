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
import type { TaskDraft } from "@/lib/care/validate";

const blank = (): TaskDraft => ({
  profileId: "",
  title: "",
  details: "",
  dueDate: "",
  completed: false,
});

export function ChecklistView() {
  const care = useCare();
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState<string | undefined>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const today = care.ready ? localISODate() : "";
  const open = care.tasks
    .filter((item) => !item.completed)
    .sort((a, b) => (a.dueDate || "9999-99-99").localeCompare(b.dueDate || "9999-99-99"));
  const done = care.tasks
    .filter((item) => item.completed)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const result = await care.saveTask(form, editing);
    if (!result.ok) {
      setErrors(result.errors);
      setStatus("");
      document.getElementById(Object.keys(result.errors)[0] ?? "")?.focus();
      return;
    }
    setForm(blank());
    setEditing(undefined);
    setErrors({});
    setStatus(editing ? "Task updated on this device." : "Task saved on this device.");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl leading-tight">Care checklist</h1>
        <p className="mt-3 max-w-3xl text-muted">
          Tasks you choose for everyday care. A completed task stays on this device until
          you delete it.
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
        <h2 className="font-serif text-3xl">{editing ? "Edit task" : "Add a task"}</h2>
        <Status>{status}</Status>
        <Field id="title" label="Task" error={errors.title}>
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
        <Field id="dueDate" label="Due date (optional)" error={errors.dueDate}>
          {(describedBy) => (
            <input
              id="dueDate"
              className={fieldClass}
              type="date"
              value={form.dueDate}
              aria-invalid={Boolean(errors.dueDate)}
              aria-describedby={describedBy}
              onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
            />
          )}
        </Field>
        <Field id="details" label="Details" error={errors.details}>
          {(describedBy) => (
            <textarea
              id="details"
              className={fieldClass}
              rows={3}
              value={form.details}
              aria-describedby={describedBy}
              onChange={(event) => setForm({ ...form, details: event.target.value })}
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
            {editing ? "Save changes" : "Save task"}
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
      <section className="space-y-4" aria-labelledby="open-tasks">
        <h2 id="open-tasks" className="font-serif text-3xl">
          Open
        </h2>
        {care.ready && open.length === 0 ? (
          <EmptyState title="No open tasks">
            <p>Add something you want to remember, with a due date if it has one.</p>
          </EmptyState>
        ) : null}
        <ul className="space-y-4">
          {open.map((item) => (
            <TaskCard
              key={item.id}
              title={item.title}
              due={
                item.dueDate
                  ? today && item.dueDate < today
                    ? `Overdue · ${formatDay(item.dueDate)}`
                    : formatDay(item.dueDate)
                  : "No due date"
              }
              details={item.details}
              profile={care.profiles.find((entry) => entry.id === item.profileId)}
              actionLabel="Mark complete"
              onAction={() =>
                void care
                  .saveTask(
                    {
                      profileId: item.profileId,
                      title: item.title,
                      details: item.details,
                      dueDate: item.dueDate,
                      completed: true,
                    },
                    item.id,
                  )
                  .then(() => setStatus("Marked complete on this device."))
              }
              onEdit={() => {
                setEditing(item.id);
                setForm({
                  profileId: item.profileId,
                  title: item.title,
                  details: item.details,
                  dueDate: item.dueDate,
                  completed: item.completed,
                });
                document.getElementById("title")?.focus();
              }}
              onDelete={() => setPendingDelete(item.id)}
            />
          ))}
        </ul>
      </section>
      <section className="space-y-4" aria-labelledby="completed-tasks">
        <h2 id="completed-tasks" className="font-serif text-3xl">
          Completed
        </h2>
        {care.ready && done.length === 0 ? (
          <EmptyState title="Nothing completed yet">
            <p>Completed tasks stay listed here so you can mark them not done again.</p>
          </EmptyState>
        ) : null}
        <ul className="space-y-4">
          {done.map((item) => (
            <TaskCard
              key={item.id}
              title={item.title}
              due="Completed"
              details={item.details}
              profile={care.profiles.find((entry) => entry.id === item.profileId)}
              actionLabel="Mark not done"
              onAction={() =>
                void care
                  .saveTask(
                    {
                      profileId: item.profileId,
                      title: item.title,
                      details: item.details,
                      dueDate: item.dueDate,
                      completed: false,
                    },
                    item.id,
                  )
                  .then(() => setStatus("Marked not done on this device."))
              }
              onEdit={() => {
                setEditing(item.id);
                setForm({
                  profileId: item.profileId,
                  title: item.title,
                  details: item.details,
                  dueDate: item.dueDate,
                  completed: true,
                });
                document.getElementById("title")?.focus();
              }}
              onDelete={() => setPendingDelete(item.id)}
            />
          ))}
        </ul>
      </section>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Remove this task?"
        confirmLabel="Remove task"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) void care.removeTask(pendingDelete);
          setPendingDelete(null);
          setStatus("Task removed from this device.");
        }}
      >
        <p>This deletes the task from this device only.</p>
      </ConfirmDialog>
    </div>
  );
}

function TaskCard({
  title,
  due,
  details,
  profile,
  actionLabel,
  onAction,
  onEdit,
  onDelete,
}: {
  title: string;
  due: string;
  details: string;
  profile?: { name: string; relationship: string };
  actionLabel: string;
  onAction: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <li className="rounded-2xl border border-border bg-paper p-5">
      <h3 className="font-serif text-2xl">{title}</h3>
      <p className="mt-2 font-bold">{due}</p>
      {profile ? <p>{profileLabel(profile)}</p> : null}
      {details ? <p className="mt-2">{details}</p> : null}
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className={actionClass(true)} onClick={onAction}>
          {actionLabel}
        </button>
        <button type="button" className={actionClass()} onClick={onEdit}>
          Edit
        </button>
        <button type="button" className={actionClass()} onClick={onDelete}>
          Delete
        </button>
      </div>
    </li>
  );
}
