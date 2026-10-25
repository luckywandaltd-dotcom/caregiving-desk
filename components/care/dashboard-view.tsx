"use client";

import { Button } from "@/components/ui";
import { useCare } from "@/components/care/store";
import { CareLink, EmptyState } from "@/components/care/ui";
import { formatDay, localISODate, profileLabel } from "@/lib/care/model";

export function DashboardView() {
  const { ready, error, appointments, tasks, profiles, medications } = useCare();
  const today = ready ? localISODate() : "";

  const profileName = (id: string) => {
    const profile = profiles.find((item) => item.id === id);
    return profile ? profileLabel(profile) : "";
  };
  const todaysAppointments = appointments
    .filter((item) => item.date === today)
    .sort((a, b) => a.time.localeCompare(b.time) || a.title.localeCompare(b.title));
  const dueTasks = tasks
    .filter((item) => !item.completed && (!item.dueDate || item.dueDate <= today))
    .sort((a, b) => (a.dueDate || "9999").localeCompare(b.dueDate || "9999"));
  const openTasks = tasks.filter((item) => !item.completed).length;
  const currentMedicines = medications.filter((item) => item.active).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl leading-tight">Today</h1>
        <p className="mt-3 max-w-3xl text-muted">
          A simple place for the details you already have. Education only. This desk does
          not give medical advice, recommend medicines, or change doses.
        </p>
        {today ? (
          <p className="mt-3 font-bold">{formatDay(today)}</p>
        ) : (
          <p className="mt-3" role="status">
            Loading records saved on this device.
          </p>
        )}
      </div>
      {error ? (
        <p role="alert" className="font-bold">
          {error}
        </p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Appointments today", String(ready ? todaysAppointments.length : "—")],
          ["Tasks to look at", String(ready ? dueTasks.length : "—")],
          ["Current medicines recorded", String(ready ? currentMedicines : "—")],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-paper px-5 py-4"
          >
            <p className="text-muted">{label}</p>
            <p className="font-serif text-3xl">{value}</p>
          </div>
        ))}
      </div>
      <section aria-labelledby="today-appointments" className="space-y-4">
        <h2 id="today-appointments" className="font-serif text-3xl">
          Appointments today
        </h2>
        {ready && todaysAppointments.length === 0 ? (
          <EmptyState title="Nothing scheduled for today">
            <p>When you add an appointment dated today, it will show here.</p>
          </EmptyState>
        ) : null}
        <ul className="space-y-3">
          {todaysAppointments.map((item) => (
            <li key={item.id} className="rounded-2xl border border-border bg-paper p-5">
              <h3 className="font-serif text-2xl">{item.title}</h3>
              <p className="mt-2">
                {item.time || "Time not recorded"}
                {item.location ? ` · ${item.location}` : ""}
              </p>
              {profileName(item.profileId) ? <p>{profileName(item.profileId)}</p> : null}
            </li>
          ))}
        </ul>
        <CareLink
          href="/care/appointments"
          className="text-link inline-flex min-h-12 items-center font-bold"
        >
          Open the appointment planner
        </CareLink>
      </section>
      <section aria-labelledby="today-tasks" className="space-y-4">
        <h2 id="today-tasks" className="font-serif text-3xl">
          Care tasks
        </h2>
        <p className="text-muted">
          {ready
            ? `${openTasks} open ${openTasks === 1 ? "task" : "tasks"} on the checklist.`
            : "Tasks appear after records load."}
        </p>
        {ready && dueTasks.length === 0 ? (
          <EmptyState title="No tasks due today">
            <p>
              Overdue tasks and tasks due today show here. Other open tasks stay on the
              checklist.
            </p>
          </EmptyState>
        ) : null}
        <ul className="space-y-3">
          {dueTasks.map((item) => (
            <li key={item.id} className="rounded-2xl border border-border bg-paper p-5">
              <h3 className="font-serif text-2xl">{item.title}</h3>
              <p className="mt-2 font-bold">
                {!item.dueDate
                  ? "No due date"
                  : item.dueDate < today
                    ? `Overdue · ${formatDay(item.dueDate)}`
                    : "Due today"}
              </p>
            </li>
          ))}
        </ul>
        <CareLink
          href="/care/checklist"
          className="text-link inline-flex min-h-12 items-center font-bold"
        >
          Open the checklist
        </CareLink>
      </section>
      <section aria-labelledby="quick-links" className="space-y-4">
        <h2 id="quick-links" className="font-serif text-3xl">
          Quick links
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button href="/care/profiles">Profiles</Button>
          <Button href="/care/medications" variant="secondary">
            Medicines
          </Button>
          <Button href="/care/notes" variant="secondary">
            Notes
          </Button>
          <Button href="/care/resources" variant="secondary">
            Resources
          </Button>
          <Button href="/free-fridge-sheet" variant="secondary">
            Free fridge sheet
          </Button>
        </div>
      </section>
    </div>
  );
}
