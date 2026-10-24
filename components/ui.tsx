import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type BlockProps = { children: ReactNode; className?: string; id?: string };
export function Container({ children, className = "", ...props }: BlockProps) {
  return (
    <div
      className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
export function Section({ children, className = "", ...props }: BlockProps) {
  return (
    <section className={`py-14 sm:py-20 ${className}`} {...props}>
      {children}
    </section>
  );
}
export function Card({ children, className = "", ...props }: BlockProps) {
  return (
    <div className={`rounded-2xl border border-border bg-paper ${className}`} {...props}>
      {children}
    </div>
  );
}
type ButtonProps = {
  href?: string;
  variant?: "primary" | "secondary" | "text";
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
} & ComponentPropsWithoutRef<"button">;
export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  target,
  rel,
  ...props
}: ButtonProps) {
  const styles = {
    primary: "border-forest bg-forest text-white hover:bg-ink hover:border-ink",
    secondary: "border-border bg-transparent text-ink hover:border-forest hover:bg-sage",
    text: "border-transparent bg-transparent text-forest underline decoration-1 underline-offset-4 hover:bg-sage",
  };
  const classes = `inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border px-6 py-3 text-[18px] font-bold leading-snug transition-colors disabled:opacity-60 ${styles[variant]} ${className}`;
  if (href)
    return (
      <Link
        href={href}
        className={classes}
        target={target}
        rel={rel}
        aria-label={props["aria-label"]}
      >
        {children}
      </Link>
    );
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
