const CACHE = "caregiving-desk-care-v1";
const PRECACHE = [
  "/care",
  "/care/profiles",
  "/care/medications",
  "/care/appointments",
  "/care/checklist",
  "/care/notes",
  "/care/resources",
  "/care/data",
  "/downloads/parents-care-information-printable.pdf",
  "/care/manifest.webmanifest",
  "/care/icon-192.png",
  "/care/icon-512.png",
  "/care/icon-maskable-512.png",
];

function cacheKey(request) {
  const url = new URL(request.url);
  const rsc = request.headers.get("RSC") === "1" || url.searchParams.has("_rsc");
  if (!rsc) return request;
  url.searchParams.set("__care_cache", "rsc");
  return new Request(url.toString(), { method: "GET" });
}

async function put(cache, request, response) {
  if (!response || !response.ok) return;
  await cache.put(cacheKey(request), response.clone());
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await Promise.all(
        PRECACHE.map(async (path) => {
          try {
            const response = await fetch(path, {
              headers: { Accept: "text/html,application/xhtml+xml,application/pdf,*/*" },
            });
            if (response.ok) await cache.put(path, response);
          } catch {
            // A missing precache item should not block the rest of the desk.
          }
        }),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_URLS" || !Array.isArray(event.data.urls)) return;
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const origin = self.location.origin;
      for (const url of event.data.urls) {
        try {
          const parsed = new URL(url);
          if (parsed.origin !== origin) continue;
          const response = await fetch(parsed.pathname + parsed.search, {
            headers: { Accept: "text/html,application/xhtml+xml,*/*" },
          });
          if (response.ok) await cache.put(parsed.pathname + parsed.search, response);
        } catch {
          // Ignore individual cache failures.
        }
      }
      event.source?.postMessage({ type: "CACHE_URLS_DONE" });
    })(),
  );
});

function offlinePage() {
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline | Caregiving Desk</title><body style="margin:0;background:#f8f7f2;color:#273b32;font:18px/1.5 Arial,sans-serif;padding:2rem"><h1 style="font:36px Georgia,serif">You are offline</h1><p>This care page is not saved on this device yet. Reconnect once, open the page, then try again. Records already saved stay in this browser and are not uploaded.</p></body></html>`;
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

async function networkFirst(request) {
  const key = cacheKey(request);
  try {
    const fresh = await fetch(request);
    if (fresh.ok) {
      const cache = await caches.open(CACHE);
      await put(cache, request, fresh);
    }
    return fresh;
  } catch {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(key);
    if (cached) return cached;
    const url = new URL(request.url);
    if (
      request.mode === "navigate" &&
      (url.pathname === "/care" || url.pathname.startsWith("/care/"))
    ) {
      const desk = await cache.match("/care");
      if (desk && url.pathname !== "/care") return desk;
      return offlinePage();
    }
    return new Response("Offline", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (
    url.pathname.includes("webpack-hmr") ||
    url.pathname.includes("turbopack") ||
    url.pathname.includes("/__nextjs") ||
    url.pathname === "/sw.js"
  ) {
    return;
  }
  const careNavigation =
    request.mode === "navigate" &&
    (url.pathname === "/care" || url.pathname.startsWith("/care/"));
  const asset =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/care/") ||
    url.pathname.startsWith("/downloads/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname === "/icon.svg";
  if (!careNavigation && !asset) return;
  event.respondWith(networkFirst(request));
});
