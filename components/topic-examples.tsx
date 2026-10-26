import {
  examplesForCategory,
  type ExampleSource,
  type HomepageExampleGroup,
} from "@/content/homepage-examples";
import type { TipCategory } from "@/content/tips";

function SourceLink({ source }: { source: ExampleSource }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-12 items-center font-semibold text-forest underline decoration-forest/40 underline-offset-4 hover:decoration-forest"
    >
      Source: {source.name}
      <span className="sr-only">, {source.detail}</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export function TopicExamples({ category }: { category: TipCategory }) {
  const group: HomepageExampleGroup | undefined = examplesForCategory(category);
  if (!group) return null;

  return (
    <section aria-labelledby={`examples-${category.replace(/\s+/g, "-").toLowerCase()}`}>
      <h3
        id={`examples-${category.replace(/\s+/g, "-").toLowerCase()}`}
        className="text-[18px] font-bold text-forest"
      >
        Examples for {category}
      </h3>
      <ul className="mt-3 space-y-4">
        {group.examples.map((example) => (
          <li key={example.text} className="text-[18px] leading-relaxed">
            {example.fictional ? (
              <p>
                <span className="font-bold text-forest">Fictional example. </span>
                {example.text}
              </p>
            ) : (
              <p>{example.text}</p>
            )}
            {example.source ? <SourceLink source={example.source} /> : null}
          </li>
        ))}
      </ul>
      {group.safety ? (
        <p className="mt-4 text-[18px] leading-relaxed text-muted">{group.safety}</p>
      ) : null}
      {group.safetySources ? (
        <ul className="mt-1 flex flex-col">
          {group.safetySources.map((source) => (
            <li key={source.detail}>
              <SourceLink source={source} />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
