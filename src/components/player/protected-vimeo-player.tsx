"use client";

import { useEffect, useRef, useState } from "react";
import Player from "@vimeo/player";
import { AnimatePresence, motion } from "framer-motion";
import { cn, formatDateTime } from "@/lib/utils";

type ProtectedVimeoPlayerProps = {
  videoId: string;
  hash?: string;
  provider?: "vimeo" | "youtube" | "file";
  mode?: "trailer" | "protected";
  student?: { id: string; email: string };
  className?: string;
  onEnded?: () => void;
};

const BLOCKED_KEYS = new Set(["F12", "PrintScreen"]);

function isBlockedCombo(event: KeyboardEvent) {
  const key = event.key.toLowerCase();
  const ctrl = event.ctrlKey || event.metaKey;
  if (BLOCKED_KEYS.has(event.key)) return true;
  if (ctrl && event.shiftKey && ["i", "j", "c", "k"].includes(key)) return true;
  if (ctrl && ["u", "s"].includes(key)) return true;
  if (event.metaKey && event.altKey && ["i", "j", "c"].includes(key)) return true;
  if (event.metaKey && event.shiftKey && ["3", "4", "5"].includes(key)) return true;
  return false;
}

function randomPosition() {
  return {
    x: 6 + Math.random() * 68,
    y: 8 + Math.random() * 72,
  };
}

export function ProtectedVimeoPlayer({
  videoId,
  hash,
  provider = "vimeo",
  mode = "protected",
  student,
  className,
  onEnded,
}: ProtectedVimeoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [obscured, setObscured] = useState(false);
  const [stamp, setStamp] = useState(() => formatDateTime(new Date()));
  const [pos, setPos] = useState(randomPosition);
  const locked = mode === "protected";
  const kind = provider || "vimeo";
  const src = kind === "vimeo" ? buildEmbedSrc(videoId, hash) : null;
  const youtubeSrc =
    kind === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0&modestbranding=1&playsinline=1`
      : null;

  useEffect(() => {
    if (kind !== "vimeo" || !iframeRef.current || !videoId) return;
    const player = new Player(iframeRef.current);
    const handleEnded = () => onEnded?.();
    player.on("ended", handleEnded);
    return () => {
      player.off("ended", handleEnded);
      void player.unload().catch(() => undefined);
    };
  }, [src, kind, videoId, onEnded]);

  useEffect(() => {
    if (!locked) return;

    const blur = () => setObscured(true);
    const focus = () => {
      if (document.visibilityState === "visible" && document.hasFocus()) {
        setObscured(false);
      }
    };
    const onVisibility = () => {
      setObscured(document.visibilityState !== "visible");
    };
    const onContext = (event: Event) => event.preventDefault();
    const onKey = (event: KeyboardEvent) => {
      if (isBlockedCombo(event)) {
        event.preventDefault();
        event.stopPropagation();
        setObscured(true);
      }
    };
    const onDrag = (event: DragEvent) => event.preventDefault();

    window.addEventListener("blur", blur);
    window.addEventListener("focus", focus);
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("contextmenu", onContext);
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("dragstart", onDrag);

    return () => {
      window.removeEventListener("blur", blur);
      window.removeEventListener("focus", focus);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("dragstart", onDrag);
    };
  }, [locked]);

  useEffect(() => {
    if (!locked) return;
    let timer: number;
    const loop = () => {
      setPos(randomPosition());
      setStamp(formatDateTime(new Date()));
      timer = window.setTimeout(loop, 5000 + Math.random() * 3000);
    };
    timer = window.setTimeout(loop, 6000);
    return () => window.clearTimeout(timer);
  }, [locked]);

  const watermark = student
    ? `${student.email}  ·  ${student.id}  ·  ${stamp}`
    : `EVIA guest  ·  ${stamp}`;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-black glow-border no-select",
        obscured && "player-blurred",
        className,
      )}
      onContextMenu={(event) => locked && event.preventDefault()}
    >
      <div className="pointer-events-none absolute inset-0 z-10 mix-blend-overlay opacity-20 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.35),transparent_40%)]" />
      {kind === "file" && videoId ? (
        <video
          className="aspect-video w-full"
          src={videoId}
          controls
          playsInline
          controlsList="nodownload"
          onContextMenu={(event) => locked && event.preventDefault()}
          onEnded={() => onEnded?.()}
        />
      ) : youtubeSrc ? (
        <iframe
          className="aspect-video w-full"
          src={youtubeSrc}
          title="EVIA player"
          allow="autoplay; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : videoId ? (
        <iframe
          ref={iframeRef}
          className="vimeo-frame aspect-video w-full"
          src={src ?? undefined}
          title="EVIA player"
          allow="autoplay; fullscreen"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <div className="grid aspect-video place-items-center bg-muted text-sm text-muted-foreground">
          لم يُضف فيديو بعد
        </div>
      )}
      {locked ? (
        <AnimatePresence>
          <motion.div
            key={`${pos.x}-${pos.y}-${stamp}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none absolute z-20 max-w-[80%] rounded-md bg-black/20 px-2 py-1 text-[11px] tracking-wide text-white/80 backdrop-blur-[1px]"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            {watermark}
          </motion.div>
        </AnimatePresence>
      ) : null}
      {obscured ? (
        <div className="absolute inset-0 z-30 grid place-items-center bg-primary/10 backdrop-blur-md">
          <p className="text-sm text-foreground">تم إخفاء المشغّل لحماية المحتوى</p>
        </div>
      ) : null}
    </div>
  );
}

function buildEmbedSrc(videoId: string, hash?: string) {
  const params = new URLSearchParams({
    dnt: "1",
    title: "0",
    byline: "0",
    portrait: "0",
    badge: "0",
    autopause: "0",
    keyboard: "0",
    transparent: "0",
    playsinline: "1",
  });
  if (hash) params.set("h", hash);
  return `https://player.vimeo.com/video/${encodeURIComponent(videoId)}?${params.toString()}`;
}
