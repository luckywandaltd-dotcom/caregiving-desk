import {
  DB_NAME,
  DB_VERSION,
  STORE_NAMES,
  type CareRecords,
  type Medication,
  type Note,
  type Appointment,
  type Profile,
  type StoreName,
  type Task,
} from "@/lib/care/model";

let opening: Promise<IDBDatabase> | null = null;

function openDb() {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("This browser cannot store records on the device."));
  }
  if (!opening) {
    opening = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        for (const name of STORE_NAMES) {
          if (!db.objectStoreNames.contains(name)) {
            db.createObjectStore(name, { keyPath: "id" });
          }
        }
      };
      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => {
          db.close();
          opening = null;
        };
        db.onclose = () => {
          opening = null;
        };
        resolve(db);
      };
      request.onerror = () => {
        opening = null;
        reject(request.error ?? new Error("Records could not be opened on this device."));
      };
    });
  }
  return opening;
}

function finish(tx: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("The records could not be saved."));
    tx.onabort = () => reject(tx.error ?? new Error("Saving was cancelled."));
  });
}

function readStore<T>(name: StoreName) {
  return openDb().then(
    (db) =>
      new Promise<T[]>((resolve, reject) => {
        const tx = db.transaction(name, "readonly");
        const request = tx.objectStore(name).getAll();
        request.onsuccess = () => resolve(request.result as T[]);
        request.onerror = () => reject(request.error);
      }),
  );
}

export function loadRecords(): Promise<CareRecords> {
  return Promise.all([
    readStore<Profile>("profiles"),
    readStore<Medication>("medications"),
    readStore<Appointment>("appointments"),
    readStore<Task>("tasks"),
    readStore<Note>("notes"),
  ]).then(([profiles, medications, appointments, tasks, notes]) => ({
    profiles,
    medications,
    appointments,
    tasks,
    notes,
  }));
}

export function putRecord(name: StoreName, record: { id: string }) {
  return openDb().then((db) => {
    const tx = db.transaction(name, "readwrite");
    tx.objectStore(name).put(record);
    return finish(tx);
  });
}

export function deleteRecord(name: StoreName, id: string) {
  return openDb().then((db) => {
    const tx = db.transaction(name, "readwrite");
    tx.objectStore(name).delete(id);
    return finish(tx);
  });
}

export function deleteProfileAndUnlink(id: string) {
  return openDb().then(
    (db) =>
      new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAMES, "readwrite");
        tx.oncomplete = () => resolve();
        tx.onerror = () =>
          reject(tx.error ?? new Error("The profile could not be removed."));
        tx.onabort = () =>
          reject(tx.error ?? new Error("Removing the profile was cancelled."));
        tx.objectStore("profiles").delete(id);
        for (const name of ["medications", "appointments", "tasks", "notes"] as const) {
          const store = tx.objectStore(name);
          const request = store.getAll();
          request.onsuccess = () => {
            for (const record of request.result as { id: string; profileId?: string }[]) {
              if (record.profileId === id) store.put({ ...record, profileId: "" });
            }
          };
        }
      }),
  );
}

export function writeRecords(records: CareRecords, mode: "merge" | "replace") {
  return openDb().then(
    (db) =>
      new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAMES, "readwrite");
        tx.oncomplete = () => resolve();
        tx.onerror = () =>
          reject(tx.error ?? new Error("The import could not be saved."));
        tx.onabort = () => reject(tx.error ?? new Error("The import was cancelled."));
        for (const name of STORE_NAMES) {
          const store = tx.objectStore(name);
          if (mode === "replace") store.clear();
          for (const record of records[name]) store.put(record);
        }
      }),
  );
}

export function clearRecords() {
  return openDb().then(
    (db) =>
      new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAMES, "readwrite");
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error ?? new Error("Records could not be deleted."));
        tx.onabort = () =>
          reject(tx.error ?? new Error("Deleting records was cancelled."));
        for (const name of STORE_NAMES) tx.objectStore(name).clear();
      }),
  );
}
