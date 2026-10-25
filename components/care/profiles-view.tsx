"use client";

import { useState, type FormEvent } from "react";
import { useCare } from "@/components/care/store";
import {
  ConfirmDialog,
  EmptyState,
  Field,
  Status,
  actionClass,
  fieldClass,
} from "@/components/care/ui";
import {
  createId,
  formatWhen,
  profileLabel,
  type EmergencyContact,
} from "@/lib/care/model";
import type { ProfileDraft } from "@/lib/care/validate";

type ContactDraft = EmergencyContact & { key: string };

const blankContact = (): ContactDraft => ({
  key: createId(),
  name: "",
  phone: "",
  relationship: "",
});

const blank = (): ProfileDraft & { contacts: ContactDraft[] } => ({
  name: "",
  relationship: "",
  emergencyContacts: [],
  contacts: [blankContact()],
  allergies: "",
  doctorName: "",
  doctorPhone: "",
  doctorClinic: "",
  pharmacyName: "",
  pharmacyPhone: "",
  pharmacyAddress: "",
  notes: "",
});

export function ProfilesView() {
  const { ready, error, profiles, saveProfile, removeProfile } = useCare();
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState<string | undefined>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  function edit(id: string) {
    const profile = profiles.find((item) => item.id === id);
    if (!profile) return;
    setEditing(id);
    setErrors({});
    setStatus("");
    setForm({
      ...profile,
      contacts:
        profile.emergencyContacts.length > 0
          ? profile.emergencyContacts.map((contact) => ({ ...contact, key: createId() }))
          : [blankContact()],
    });
    document.getElementById("name")?.focus();
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const result = await saveProfile(
      {
        ...form,
        emergencyContacts: form.contacts.map(({ name, phone, relationship }) => ({
          name,
          phone,
          relationship,
        })),
      },
      editing,
    );
    if (!result.ok) {
      setErrors(result.errors);
      setStatus("");
      const first = Object.keys(result.errors)[0];
      if (first?.startsWith("contact-")) {
        const [, index, field] = first.split("-");
        document.getElementById(`contact-${index}-${field}`)?.focus();
      } else document.getElementById(first)?.focus();
      return;
    }
    setForm(blank());
    setEditing(undefined);
    setErrors({});
    setStatus(
      editing ? "Profile updated on this device." : "Profile saved on this device.",
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl leading-tight">Care profiles</h1>
        <p className="mt-3 max-w-3xl text-muted">
          Names are optional. Add only the emergency contacts, allergies, doctor, and
          pharmacy details you want nearby. This is your own note, not a medical record
          and not medical advice.
        </p>
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
          {editing ? "Edit profile" : "Add a profile"}
        </h2>
        <Status>{status}</Status>
        <Field id="name" label="Name (optional)" error={errors.name}>
          {(describedBy) => (
            <input
              id="name"
              className={fieldClass}
              value={form.name}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describedBy}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
          )}
        </Field>
        <Field
          id="relationship"
          label="Relationship or role (optional)"
          hint="For example: parent, neighbor, or myself."
          error={errors.relationship}
        >
          {(describedBy) => (
            <input
              id="relationship"
              className={fieldClass}
              value={form.relationship}
              aria-invalid={Boolean(errors.relationship)}
              aria-describedby={describedBy}
              onChange={(event) => setForm({ ...form, relationship: event.target.value })}
            />
          )}
        </Field>
        <fieldset className="space-y-4">
          <legend className="font-bold">Emergency contacts</legend>
          {errors.emergencyContacts ? (
            <p role="alert" className="font-bold">
              {errors.emergencyContacts}
            </p>
          ) : null}
          {form.contacts.map((contact, index) => (
            <div
              key={contact.key}
              className="grid gap-4 rounded-xl border border-border p-4"
            >
              <Field
                id={`contact-${index}-name`}
                label="Contact name"
                error={errors[`contact-${index}-name`]}
              >
                {(describedBy) => (
                  <input
                    id={`contact-${index}-name`}
                    className={fieldClass}
                    autoComplete="name"
                    value={contact.name}
                    aria-invalid={Boolean(errors[`contact-${index}-name`])}
                    aria-describedby={describedBy}
                    onChange={(event) => {
                      const contacts = form.contacts.slice();
                      contacts[index] = { ...contact, name: event.target.value };
                      setForm({ ...form, contacts });
                    }}
                  />
                )}
              </Field>
              <Field
                id={`contact-${index}-phone`}
                label="Phone"
                error={errors[`contact-${index}-phone`]}
              >
                {(describedBy) => (
                  <input
                    id={`contact-${index}-phone`}
                    className={fieldClass}
                    type="tel"
                    autoComplete="tel"
                    value={contact.phone}
                    aria-invalid={Boolean(errors[`contact-${index}-phone`])}
                    aria-describedby={describedBy}
                    onChange={(event) => {
                      const contacts = form.contacts.slice();
                      contacts[index] = { ...contact, phone: event.target.value };
                      setForm({ ...form, contacts });
                    }}
                  />
                )}
              </Field>
              <Field
                id={`contact-${index}-relationship`}
                label="Relationship"
                error={errors[`contact-${index}-relationship`]}
              >
                {(describedBy) => (
                  <input
                    id={`contact-${index}-relationship`}
                    className={fieldClass}
                    value={contact.relationship}
                    aria-invalid={Boolean(errors[`contact-${index}-relationship`])}
                    aria-describedby={describedBy}
                    onChange={(event) => {
                      const contacts = form.contacts.slice();
                      contacts[index] = { ...contact, relationship: event.target.value };
                      setForm({ ...form, contacts });
                    }}
                  />
                )}
              </Field>
              {form.contacts.length > 1 ? (
                <button
                  type="button"
                  className={actionClass()}
                  onClick={() =>
                    setForm({
                      ...form,
                      contacts: form.contacts.filter((item) => item.key !== contact.key),
                    })
                  }
                >
                  Remove this contact
                </button>
              ) : null}
            </div>
          ))}
          <button
            type="button"
            className={actionClass()}
            onClick={() =>
              setForm({ ...form, contacts: [...form.contacts, blankContact()] })
            }
          >
            Add emergency contact
          </button>
        </fieldset>
        <Field
          id="allergies"
          label="Allergies (as you record them)"
          hint="Write what you already know. This desk does not check medicines against allergies."
          error={errors.allergies}
        >
          {(describedBy) => (
            <textarea
              id="allergies"
              className={fieldClass}
              rows={3}
              value={form.allergies}
              aria-invalid={Boolean(errors.allergies)}
              aria-describedby={describedBy}
              onChange={(event) => setForm({ ...form, allergies: event.target.value })}
            />
          )}
        </Field>
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-2 font-bold sm:col-span-2">Doctor</legend>
          <Field id="doctorName" label="Doctor name" error={errors.doctorName}>
            {(describedBy) => (
              <input
                id="doctorName"
                className={fieldClass}
                value={form.doctorName}
                aria-describedby={describedBy}
                aria-invalid={Boolean(errors.doctorName)}
                onChange={(event) => setForm({ ...form, doctorName: event.target.value })}
              />
            )}
          </Field>
          <Field id="doctorPhone" label="Doctor phone" error={errors.doctorPhone}>
            {(describedBy) => (
              <input
                id="doctorPhone"
                className={fieldClass}
                type="tel"
                autoComplete="tel"
                value={form.doctorPhone}
                aria-describedby={describedBy}
                aria-invalid={Boolean(errors.doctorPhone)}
                onChange={(event) =>
                  setForm({ ...form, doctorPhone: event.target.value })
                }
              />
            )}
          </Field>
          <Field id="doctorClinic" label="Clinic or office" error={errors.doctorClinic}>
            {(describedBy) => (
              <input
                id="doctorClinic"
                className={fieldClass}
                value={form.doctorClinic}
                aria-describedby={describedBy}
                aria-invalid={Boolean(errors.doctorClinic)}
                onChange={(event) =>
                  setForm({ ...form, doctorClinic: event.target.value })
                }
              />
            )}
          </Field>
        </fieldset>
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-2 font-bold sm:col-span-2">Pharmacy</legend>
          <Field id="pharmacyName" label="Pharmacy name" error={errors.pharmacyName}>
            {(describedBy) => (
              <input
                id="pharmacyName"
                className={fieldClass}
                value={form.pharmacyName}
                aria-describedby={describedBy}
                aria-invalid={Boolean(errors.pharmacyName)}
                onChange={(event) =>
                  setForm({ ...form, pharmacyName: event.target.value })
                }
              />
            )}
          </Field>
          <Field id="pharmacyPhone" label="Pharmacy phone" error={errors.pharmacyPhone}>
            {(describedBy) => (
              <input
                id="pharmacyPhone"
                className={fieldClass}
                type="tel"
                autoComplete="tel"
                value={form.pharmacyPhone}
                aria-describedby={describedBy}
                aria-invalid={Boolean(errors.pharmacyPhone)}
                onChange={(event) =>
                  setForm({ ...form, pharmacyPhone: event.target.value })
                }
              />
            )}
          </Field>
          <Field
            id="pharmacyAddress"
            label="Pharmacy address"
            error={errors.pharmacyAddress}
          >
            {(describedBy) => (
              <input
                id="pharmacyAddress"
                className={`${fieldClass} sm:col-span-2`}
                value={form.pharmacyAddress}
                aria-describedby={describedBy}
                aria-invalid={Boolean(errors.pharmacyAddress)}
                onChange={(event) =>
                  setForm({ ...form, pharmacyAddress: event.target.value })
                }
              />
            )}
          </Field>
        </fieldset>
        <Field id="profile-notes" label="Other notes" error={errors.notes}>
          {(describedBy) => (
            <textarea
              id="profile-notes"
              className={fieldClass}
              rows={3}
              value={form.notes}
              aria-describedby={describedBy}
              aria-invalid={Boolean(errors.notes)}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
            />
          )}
        </Field>
        <div className="flex flex-wrap gap-3">
          <button type="submit" className={actionClass(true)}>
            {editing ? "Save changes" : "Save profile"}
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
      {ready && profiles.length === 0 ? (
        <EmptyState title="No profiles yet">
          <p>
            A blank name is fine. The profile will be labeled from the relationship, or
            shown as Care profile.
          </p>
        </EmptyState>
      ) : null}
      <ul className="space-y-4">
        {profiles.map((profile) => (
          <li key={profile.id} className="rounded-2xl border border-border bg-paper p-5">
            <h2 className="font-serif text-2xl">{profileLabel(profile)}</h2>
            <p className="mt-2 text-muted">Updated {formatWhen(profile.updatedAt)}</p>
            {profile.allergies ? (
              <p className="mt-3">
                <span className="font-bold">Allergies recorded: </span>
                {profile.allergies}
              </p>
            ) : null}
            {profile.doctorName || profile.doctorPhone || profile.doctorClinic ? (
              <p className="mt-2">
                <span className="font-bold">Doctor: </span>
                {[profile.doctorName, profile.doctorPhone, profile.doctorClinic]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            ) : null}
            {profile.pharmacyName || profile.pharmacyPhone || profile.pharmacyAddress ? (
              <p className="mt-2">
                <span className="font-bold">Pharmacy: </span>
                {[profile.pharmacyName, profile.pharmacyPhone, profile.pharmacyAddress]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            ) : null}
            {profile.emergencyContacts.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {profile.emergencyContacts.map((contact) => (
                  <li key={`${contact.name}-${contact.phone}`}>
                    <span className="font-bold">Emergency contact: </span>
                    {[contact.name, contact.relationship, contact.phone]
                      .filter(Boolean)
                      .join(" · ")}
                  </li>
                ))}
              </ul>
            ) : null}
            {profile.notes ? <p className="mt-3">{profile.notes}</p> : null}
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                className={actionClass()}
                onClick={() => edit(profile.id)}
              >
                Edit
              </button>
              <button
                type="button"
                className={actionClass()}
                onClick={() => setPendingDelete(profile.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Remove this profile?"
        confirmLabel="Remove profile"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) void removeProfile(pendingDelete);
          if (editing === pendingDelete) {
            setEditing(undefined);
            setForm(blank());
          }
          setPendingDelete(null);
          setStatus(
            "Profile removed from this device. Linked notes stay, without that profile.",
          );
        }}
      >
        <p>
          Medicines, appointments, tasks, and notes stay on this device, but they will no
          longer name this profile.
        </p>
      </ConfirmDialog>
    </div>
  );
}
