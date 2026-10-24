import { site } from "@/content/site";

export function Disclaimer({ className = "" }: { className?: string }) {
  return <p className={`leading-relaxed ${className}`}>{site.disclaimer}</p>;
}
