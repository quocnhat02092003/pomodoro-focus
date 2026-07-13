"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTimerStore } from "@/stores/timer-store";
import { formatTime } from "@/lib/utils";
import { SessionType } from "@/types/pomodoro";

const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;
const DRAW_INTERVAL_MS = 250;

interface SessionMeta {
  label: string;
  color: string;
  track: string;
  bg: string;
}

const SESSION_META: Record<SessionType, SessionMeta> = {
  FOCUS: { label: "Focus Session", color: "#ef4444", track: "#7f1d1d", bg: "#1c0c0c" },
  SHORT_BREAK: { label: "Short Break", color: "#10b981", track: "#064e3b", bg: "#08170f" },
  LONG_BREAK: { label: "Long Break", color: "#3b82f6", track: "#1e3a8a", bg: "#0a0f1c" },
};

function drawFrame(
  ctx: CanvasRenderingContext2D,
  {
    timeRemaining,
    totalDuration,
    sessionType,
    isPaused,
    isRunning,
  }: {
    timeRemaining: number;
    totalDuration: number;
    sessionType: SessionType;
    isPaused: boolean;
    isRunning: boolean;
  }
) {
  const meta = SESSION_META[sessionType];
  const w = CANVAS_WIDTH;
  const h = CANVAS_HEIGHT;

  // Background
  ctx.fillStyle = meta.bg;
  ctx.fillRect(0, 0, w, h);

  // Everything scales off the canvas height so the layout fills the window.
  const cx = w / 2;
  const cy = h / 2 + h * 0.03;
  const radius = h * 0.34;
  const lineWidth = h * 0.035;
  const progress =
    totalDuration > 0
      ? Math.min(1, Math.max(0, (totalDuration - timeRemaining) / totalDuration))
      : 0;

  // Track
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = meta.track;
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  // Progress arc (starts at 12 o'clock, clockwise)
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + progress * Math.PI * 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, endAngle);
  ctx.strokeStyle = meta.color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.stroke();

  // Session label (top)
  ctx.fillStyle = meta.color;
  ctx.font = `600 ${Math.round(h * 0.06)}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🍅 " + meta.label, cx, h * 0.11);

  // Time remaining (center)
  ctx.fillStyle = "#ffffff";
  ctx.font = `700 ${Math.round(h * 0.2)}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.fillText(formatTime(timeRemaining), cx, cy - h * 0.01);

  // Status (bottom)
  let status = "Ready";
  if (isPaused) status = "⏸ Paused";
  else if (isRunning) status = "In progress";
  else if (timeRemaining === 0) status = "✓ Completed";

  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = `500 ${Math.round(h * 0.05)}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.fillText(status, cx, cy + radius - h * 0.1);
}

export function usePictureInPicture() {
  const [isSupported, setIsSupported] = useState(false);
  const [isPipActive, setIsPipActive] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // requestPictureInPicture on <video> is not on the type by default in older libs.
    const supported =
      typeof document !== "undefined" &&
      "pictureInPictureEnabled" in document &&
      (document as Document).pictureInPictureEnabled;
    setIsSupported(Boolean(supported));
  }, []);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.remove();
      videoRef.current = null;
    }
    canvasRef.current = null;
  }, []);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const {
      timeRemaining,
      sessionType,
      isPaused,
      isRunning,
      focusDuration,
      shortBreakDuration,
      longBreakDuration,
    } = useTimerStore.getState();

    const totalDurationMap: Record<SessionType, number> = {
      FOCUS: focusDuration,
      SHORT_BREAK: shortBreakDuration,
      LONG_BREAK: longBreakDuration,
    };

    drawFrame(ctx, {
      timeRemaining,
      totalDuration: totalDurationMap[sessionType],
      sessionType,
      isPaused,
      isRunning,
    });
  }, []);

  const enterPip = useCallback(async () => {
    if (!isSupported) return;

    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    canvasRef.current = canvas;

    // First frame before we start streaming.
    paint();

    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.style.position = "fixed";
    video.style.left = "-9999px";
    video.style.width = "1px";
    video.style.height = "1px";
    document.body.appendChild(video);
    videoRef.current = video;

    const stream = canvas.captureStream(30);
    streamRef.current = stream;
    video.srcObject = stream;

    video.addEventListener("leavepictureinpicture", () => {
      setIsPipActive(false);
      cleanup();
    });

    try {
      await video.play();
      await video.requestPictureInPicture();
      setIsPipActive(true);

      // Keep the stream fresh & the countdown in sync.
      intervalRef.current = setInterval(paint, DRAW_INTERVAL_MS);
    } catch (err) {
      console.error("Failed to enter Picture-in-Picture:", err);
      cleanup();
    }
  }, [isSupported, paint, cleanup]);

  const exitPip = useCallback(async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      }
    } catch (err) {
      console.error("Failed to exit Picture-in-Picture:", err);
    } finally {
      setIsPipActive(false);
      cleanup();
    }
  }, [cleanup]);

  const togglePip = useCallback(() => {
    if (isPipActive) {
      void exitPip();
    } else {
      void enterPip();
    }
  }, [isPipActive, enterPip, exitPip]);

  // Cleanup on unmount.
  useEffect(() => cleanup, [cleanup]);

  return { isSupported, isPipActive, togglePip, enterPip, exitPip };
}
