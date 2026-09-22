import type { VideoProvider } from "@/lib/types";

export type ParsedVideo = {
  provider: VideoProvider;
  id: string;
  hash?: string;
};

export function parseVideoLink(input: string): ParsedVideo | null {
  const raw = input.trim();
  if (!raw) return null;

  if (/^\d{5,12}$/.test(raw)) {
    return { provider: "vimeo", id: raw };
  }

  if (/^[a-zA-Z0-9_-]{11}$/.test(raw) && /[A-Za-z]/.test(raw)) {
    return { provider: "youtube", id: raw };
  }

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const parts = url.pathname.split("/").filter(Boolean);
    const videosIndex = parts.indexOf("videos");
    if (parts[0] === "manage" && videosIndex >= 0 && parts[videosIndex + 1]) {
      const id = parts[videosIndex + 1];
      if (/^\d+$/.test(id)) {
        return { provider: "vimeo", id, hash: url.searchParams.get("h") || undefined };
      }
    }
    if (parts[0] === "video" && parts[1] && /^\d+$/.test(parts[1])) {
      return {
        provider: "vimeo",
        id: parts[1],
        hash: (parts[2] && !/^\d+$/.test(parts[2]) ? parts[2] : url.searchParams.get("h")) || undefined,
      };
    }
    const id = parts.find((part) => /^\d{5,12}$/.test(part));
    if (id) {
      const index = parts.indexOf(id);
      const next = parts[index + 1];
      const hash =
        next && !/^\d+$/.test(next) && next !== "embed"
          ? next
          : url.searchParams.get("h") || undefined;
      return { provider: "vimeo", id, hash };
    }
  }

  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const v = url.searchParams.get("v");
    if (v) return { provider: "youtube", id: v };
    const match = url.pathname.match(/\/(embed|shorts|live)\/([a-zA-Z0-9_-]{11})/);
    if (match) return { provider: "youtube", id: match[2] };
  }

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    if (id) return { provider: "youtube", id: id.replace(/[^a-zA-Z0-9_-]/g, "") };
  }

  if (/\.(mp4|webm|ogg|m3u8)(\?|$)/i.test(url.pathname + url.search)) {
    return { provider: "file", id: raw };
  }

  return null;
}

export function formatVideoLink(input: {
  id: string;
  hash?: string;
  provider?: VideoProvider;
}) {
  if (!input.id) return "";
  const provider = input.provider ?? "vimeo";
  if (provider === "youtube") return `https://www.youtube.com/watch?v=${input.id}`;
  if (provider === "file") return input.id;
  return input.hash ? `https://vimeo.com/${input.id}/${input.hash}` : `https://vimeo.com/${input.id}`;
}

export function videoProviderLabel(provider?: VideoProvider) {
  if (provider === "youtube") return "YouTube";
  if (provider === "file") return "ملف فيديو";
  return "Vimeo";
}
