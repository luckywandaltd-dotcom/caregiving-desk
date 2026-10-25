"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";
import { profileLabel, type Profile } from "@/lib/care/model";

export const fieldClass =
  "w-full max-w-full rounded-lg border border-border bg-paper px-4 py-3";

export function CareLink({
  href,
  className = "",
  children,
  onClick,
  ...props
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children" | "onClick">) {
  return (
    <Link
      href={href}
      className={className}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (typeof navigator !== "undefined" && navigator.onLine === false) {
          event.preventDefault();
          window.location.assign(href);
        }
      }}
    >
      {children}
    </Link>
  );
}

export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: (describedBy?: string) => ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-bold">
        {label}
      </label>
      {hint ? (
        <p id={hintId} className="text-muted">
          {hint}
        </p>
      ) : null}
      {children(describedBy)}
      {error ? (
        <p id={errorId} role="alert" className="font-bold">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ProfileSelect({
  id,
  profiles,
  value,
  describedBy,
  onChange,
}: {
  id: string;
  profiles: Profile[];
  value: string;
  describedBy?: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      id={id}
      className={`${fieldClass} min-h-12`}
      value={value}
      aria-describedby={describedBy}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="">No linked profile</option>
      {profiles.map((profile) => (
        <option key={profile.id} value={profile.id}>
          {profileLabel(profile)}
        </option>
      ))}
    </select>
  );
}

export function Status({ children }: { children: string }) {
  if (!children) return null;
  return (
    <p role="status" className="rounded-xl bg-sage px-4 py-3 font-bold">
      {children}
    </p>
  );
}

export function EmptyState({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-paper px-5 py-8">
      <h2 className="font-serif text-2xl">{title}</h2>
      <div className="mt-3 text-muted">{children}</div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel = "Keep it",
  confirmDisabled = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  confirmDisabled?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [open]);
  if (!open) return null;
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="care-dialog"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
    >
      <h2 id={titleId} className="font-serif text-3xl">
        {title}
      </h2>
      <div className="mt-4 text-muted">{children}</div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          className="inline-flex min-h-12 items-center justify-center rounded-lg border border-forest bg-forest px-5 font-bold text-white"
          onClick={onCancel}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className="inline-flex min-h-12 items-center justify-center rounded-lg border border-border px-5 font-bold disabled:opacity-60"
          disabled={confirmDisabled}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}

export function actionClass(primary = false) {
  return primary
    ? "inline-flex min-h-12 items-center justify-center rounded-lg border border-forest bg-forest px-5 font-bold text-white"
    : "inline-flex min-h-12 items-center justify-center rounded-lg border border-border bg-paper px-5 font-bold";
}
