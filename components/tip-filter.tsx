"use client";

import { useState } from "react";
import { categories, type Tip } from "@/content/tips";
import { TipCard } from "@/components/tip-card";

export function TipFilter({ tips }: { tips: Tip[] }) {
  const [selected, setSelected] = useState<string>("All tips");
  const availableCategories = categories.filter((category) =>
    tips.some((tip) => tip.category === category),
  );
  const visible =
    selected === "All tips" ? tips : tips.filter((tip) => tip.category === selected);

  return (
    <div>
      <div
        className="flex flex-wrap gap-3"
        role="group"
        aria-label="Filter tips by category"
      >
        {["All tips", ...availableCategories].map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={selected === category}
            onClick={() => setSelected(category)}
            className={`min-h-12 rounded-full border px-5 py-2 font-bold transition-colors ${
              selected === category
                ? "border-forest bg-forest text-paper"
                : "border-border bg-paper text-ink hover:bg-sage"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <p
        className="mb-7 mt-6 text-muted"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {visible.length} {visible.length === 1 ? "tip" : "tips"}
        {selected !== "All tips" ? ` in ${selected}` : " to explore"}
      </p>
      {visible.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((tip) => (
            <TipCard key={tip.slug} tip={tip} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-paper px-6 py-12 text-center">
          <h2 className="font-serif text-3xl text-ink">A little more is on the way.</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            There are no published tips in this category yet. Explore another topic while
            we prepare more.
          </p>
          <button
            type="button"
            onClick={() => setSelected("All tips")}
            className="mt-6 min-h-12 rounded-full bg-forest px-6 py-3 font-bold text-paper hover:bg-ink"
          >
            See all tips
          </button>
        </div>
      )}
    </div>
  );
}
