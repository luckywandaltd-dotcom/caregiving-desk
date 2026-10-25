"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Button, Container } from "@/components/ui";

const links = [
  ["Home", "/"],
  ["Care desk", "/care"],
  ["Tips", "/tips"],
  ["Shop", "/shop"],
  ["Free Fridge Sheet", "/free-fridge-sheet"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 44" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 38V18m0 10C8 28 4 20 6 11c10 0 15 6 14 17Zm0-7C20 10 26 5 35 5c1 10-4 16-15 16Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m12 18 8 10m8-16-8 9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  return (
    <header
      className="sticky top-0 z-40 border-b border-border bg-cream"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      <Container>
        <div className="flex min-h-22 items-center justify-between gap-5">
          <Link
            href="/"
            className="flex min-h-12 shrink-0 items-center gap-2.5 text-forest"
            onClick={() => setOpen(false)}
          >
            <BrandMark className="hidden h-10 w-9 min-[360px]:block" />
            <span className="font-serif text-[23px] font-medium tracking-tight sm:text-[25px]">
              Caregiving Desk
            </span>
          </Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-4 xl:flex">
            {links
              .filter(([name]) => name !== "Free Fridge Sheet")
              .map(([name, href]) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={
                    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))
                      ? "page"
                      : undefined
                  }
                  className="inline-flex min-h-12 items-center px-1.5 text-[18px] hover:underline hover:underline-offset-8 aria-[current=page]:font-bold aria-[current=page]:underline aria-[current=page]:underline-offset-8"
                >
                  {name}
                </Link>
              ))}
          </nav>
          <div className="hidden xl:block">
            <Button href="/free-fridge-sheet" className="px-5">
              Get the free sheet <span aria-hidden="true">→</span>
            </Button>
          </div>
          <button
            ref={toggle}
            className="flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-lg border border-border px-3 xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            <span className="hidden sm:inline">Menu</span>
            <svg
              aria-hidden="true"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {open ? (
                <path d="m6 6 12 12M6 18 18 6" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          hidden={!open}
          className="max-h-[calc(100dvh-6rem)] overflow-auto border-t border-border py-4 xl:hidden"
        >
          {links.map(([name, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={pathname === href ? "page" : undefined}
              className="flex min-h-12 items-center rounded-lg px-3 py-2 hover:bg-sage aria-[current=page]:bg-sage aria-[current=page]:font-bold"
            >
              {name}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
