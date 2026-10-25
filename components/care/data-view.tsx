"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useCare } from "@/components/care/store";
import { ConfirmDialog, Status, actionClass, fieldClass } from "@/components/care/ui";
import { localISODate } from "@/lib/care/model";
import { parseExport } from "@/lib/care/validate";

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function DataView() {
  const care = useCare();
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [fileText, setFileText] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [understood, setUnderstood] = useState(false);
  const [confirmReplace, setConfirmReplace] = useState(false);
  const [installEvent, setInstallEvent] = useState<InstallPrompt | null>(null);
  const [installMessage, setInstallMessage] = useState("");

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPrompt);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  function download() {
    const data = care.exportRecords();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `caregiving-desk-records-${localISODate()}.json`;
    link.style.display = "none";
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setError("");
    setStatus(
      "Export downloaded. Keep that file somewhere you trust. This site does not store a backup.",
    );
  }

  async function readFile(file: File | undefined) {
    if (!file) {
      setFileText("");
      return;
    }
    setFileText(await file.text());
    setError("");
    setStatus(
      "File ready. Choose whether to add these records or replace what is on this device.",
    );
  }

  async function importMode(mode: "merge" | "replace") {
    const parsed = parseExport(fileText);
    if (!parsed.ok) {
      setStatus("");
      setError(parsed.error);
      return;
    }
    await care.importRecords(parsed.value, mode);
    setConfirmReplace(false);
    setFileText("");
    setError("");
    setStatus(
      mode === "replace"
        ? "Imported records replaced what was on this device."
        : "Imported records were added on this device.",
    );
  }

  function onReplace(event: FormEvent) {
    event.preventDefault();
    if (!fileText) {
      setError("Choose an export file first.");
      return;
    }
    setConfirmReplace(true);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl leading-tight">Your data</h1>
        <div className="mt-4 max-w-3xl space-y-3">
          <p>
            Care records are saved in this browser with IndexedDB. They stay on this
            device and in this browser profile. They are not uploaded, automatically
            shared with anyone, or backed up by Caregiving Desk.
          </p>
          <p>
            Clearing site data, switching browsers, or using another phone can hide or
            remove them. Export a file if you want your own copy. These pages do not send
            record contents to analytics. Storage here is not described as encrypted, and
            the desk is not a clinical system.
          </p>
        </div>
      </div>
      {care.error ? <p role="alert">{care.error}</p> : null}
      {!care.ready && !care.error ? (
        <p role="status">Loading records saved on this device.</p>
      ) : null}
      <Status>{status}</Status>
      {error ? (
        <p role="alert" className="font-bold">
          {error}
        </p>
      ) : null}
      <section
        className="space-y-4 rounded-2xl border border-border bg-paper p-5 sm:p-6"
        aria-labelledby="export-heading"
      >
        <h2 id="export-heading" className="font-serif text-3xl">
          Export
        </h2>
        <p>
          Download every profile, medicine, appointment, task, and note as a JSON file.
        </p>
        <button
          type="button"
          className={actionClass(true)}
          onClick={download}
          disabled={!care.ready}
        >
          Export records
        </button>
      </section>
      <section
        className="space-y-4 rounded-2xl border border-border bg-paper p-5 sm:p-6"
        aria-labelledby="import-heading"
      >
        <h2 id="import-heading" className="font-serif text-3xl">
          Import
        </h2>
        <p>
          Use a file exported from this care desk. Other files are rejected and nothing is
          changed.
        </p>
        <form className="space-y-4" onSubmit={onReplace}>
          <label className="flex flex-col gap-2 font-bold" htmlFor="import-file">
            Export file
            <input
              id="import-file"
              className={fieldClass}
              type="file"
              accept="application/json,.json"
              onChange={(event) => void readFile(event.target.files?.[0])}
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className={actionClass(true)}
              onClick={() => {
                if (!fileText) {
                  setError("Choose an export file first.");
                  return;
                }
                void importMode("merge");
              }}
            >
              Add imported records
            </button>
            <button type="submit" className={actionClass()}>
              Replace records on this device
            </button>
          </div>
        </form>
      </section>
      <section
        className="space-y-4 rounded-2xl border border-border bg-paper p-5 sm:p-6"
        aria-labelledby="delete-heading"
      >
        <h2 id="delete-heading" className="font-serif text-3xl">
          Delete all records
        </h2>
        <p>
          This removes every care record from this browser. It does not affect an export
          you already downloaded.
        </p>
        <button
          type="button"
          className={actionClass()}
          onClick={() => {
            setUnderstood(false);
            setConfirmDelete(true);
          }}
        >
          Delete all records
        </button>
      </section>
      <section className="space-y-4" aria-labelledby="install-heading">
        <h2 id="install-heading" className="font-serif text-3xl">
          Install on this device
        </h2>
        <p>
          After this care desk loads once while you are online, its pages and saved
          records can open again without a connection. Installing it adds an icon. It
          still stores records only on this device.
        </p>
        {installEvent ? (
          <button
            type="button"
            className={actionClass(true)}
            onClick={() => {
              void installEvent
                .prompt()
                .then(() => installEvent.userChoice)
                .then((choice) => {
                  setInstallMessage(
                    choice.outcome === "accepted"
                      ? "Install started."
                      : "Install was dismissed.",
                  );
                  setInstallEvent(null);
                });
            }}
          >
            Install care desk
          </button>
        ) : (
          <p>
            If your browser does not show an install button, use its Add to Home Screen or
            Install app command. On iPhone, open Share, then Add to Home Screen.
          </p>
        )}
        {installMessage ? <p role="status">{installMessage}</p> : null}
      </section>
      <ConfirmDialog
        open={confirmDelete}
        title="Delete all care records?"
        confirmLabel="Delete all records on this device"
        cancelLabel="Keep my records"
        confirmDisabled={!understood}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          void care.deleteAll();
          setConfirmDelete(false);
          setStatus("All care records were deleted from this device.");
        }}
      >
        <p>This cannot be undone unless you have an export file.</p>
        <label
          className="mt-4 flex min-h-12 items-center gap-3 font-bold text-ink"
          htmlFor="confirm-delete-all"
        >
          <input
            id="confirm-delete-all"
            className="size-6"
            type="checkbox"
            checked={understood}
            onChange={(event) => setUnderstood(event.target.checked)}
          />
          I understand this permanently removes records from this device.
        </label>
      </ConfirmDialog>
      <ConfirmDialog
        open={confirmReplace}
        title="Replace records on this device?"
        confirmLabel="Replace records"
        cancelLabel="Keep current records"
        onCancel={() => setConfirmReplace(false)}
        onConfirm={() => void importMode("replace")}
      >
        <p>
          Everything currently saved in the care desk on this device will be removed and
          replaced by the file.
        </p>
      </ConfirmDialog>
    </div>
  );
}
