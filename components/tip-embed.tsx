"use client";

import { useState } from "react";

type TipEmbedProps = {
  url: string;
  title: string;
};

type SupportedEmbed = {
  platform: "YouTube" | "Instagram";
  source: string;
  original: string;
};

function getSupportedEmbed(value: string): SupportedEmbed | null {
  try {
    const url = new URL(value);

    if (url.protocol !== "https:" || url.username || url.password || url.port) {
      return null;
    }

    const youtubeHosts = ["youtube.com", "www.youtube.com", "m.youtube.com"];
    let videoId: string | null = null;

    if (url.hostname === "youtu.be") {
      videoId = url.pathname.match(/^\/([\w-]{11})\/?$/)?.[1] ?? null;
    } else if (youtubeHosts.includes(url.hostname)) {
      videoId =
        url.pathname === "/watch"
          ? url.searchParams.get("v")
          : (url.pathname.match(/^\/(?:shorts|embed)\/([\w-]{11})\/?$/)?.[1] ?? null);
    }

    if (videoId && /^[\w-]{11}$/.test(videoId)) {
      return {
        platform: "YouTube",
        source: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`,
        original: `https://www.youtube.com/watch?v=${videoId}`,
      };
    }

    if (["instagram.com", "www.instagram.com"].includes(url.hostname)) {
      const post = url.pathname.match(/^\/(p|reel)\/([\w-]+)\/?$/);

      if (post) {
        const original = `https://www.instagram.com/${post[1]}/${post[2]}/`;

        return {
          platform: "Instagram",
          source: `${original}embed/`,
          original,
        };
      }
    }
  } catch {
    // Editable content may still contain an unfinished placeholder URL.
  }

  return null;
}

export function TipEmbed({ url, title }: TipEmbedProps) {
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const embed = getSupportedEmbed(url);

  if (!embed) return null;

  const isLoaded = loadedSource === embed.source;

  return (
    <section
      aria-label={`${embed.platform} media for ${title}`}
      className="my-10 overflow-hidden rounded-2xl border border-border bg-sage"
    >
      {isLoaded ? (
        <iframe
          src={embed.source}
          title={`${title} — ${embed.platform} ${embed.platform === "YouTube" ? "video" : "post"}`}
          loading="lazy"
          allow="encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className={
            embed.platform === "YouTube"
              ? "aspect-video w-full border-0"
              : "h-[560px] w-full border-0"
          }
        />
      ) : (
        <div className="flex min-h-64 flex-col items-center justify-center gap-5 p-6 text-center sm:p-10">
          <p className="font-serif text-2xl text-ink">A little more to explore</p>
          <p className="max-w-lg text-lg text-muted">
            Load this {embed.platform === "YouTube" ? "video" : "post"} to connect to{" "}
            {embed.platform}. The platform may use cookies and receive information about
            your visit. Nothing plays automatically.
          </p>
          <button
            type="button"
            onClick={() => setLoadedSource(embed.source)}
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-forest px-6 py-3 text-lg font-bold text-white transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest"
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="currentColor"
            >
              <path d="M5 3.2v11.6L14 9 5 3.2Z" />
            </svg>
            Load {embed.platform} {embed.platform === "YouTube" ? "video" : "post"}
          </button>
        </div>
      )}
      <div className="border-t border-border px-6 py-3">
        <a
          href={embed.original}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center text-lg text-forest underline decoration-1 underline-offset-4 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest"
        >
          Open on {embed.platform} (opens in a new tab)
        </a>
      </div>
    </section>
  );
}
