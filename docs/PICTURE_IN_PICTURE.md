# Picture-in-Picture (PiP) — Feature Flow

The Picture-in-Picture feature lets users pop the Pomodoro countdown out into a small,
**always-on-top floating window**. The timer stays visible while they work in other
tabs or apps, so they never lose track of the current session.

> **TL;DR** — PiP is a **100% client-side** feature. It renders the live timer onto an
> off-screen `<canvas>`, streams that canvas into a hidden `<video>`, and hands the video
> to the browser's native `requestPictureInPicture()` API. No new backend endpoint or
> database model is required.

---

## 1. Why canvas-based PiP?

There are two browser PiP APIs:

| API | Support | Notes |
|-----|---------|-------|
| **HTMLVideoElement PiP** (`video.requestPictureInPicture()`) | Chrome, Edge, Opera, Safari | Requires a `<video>` element. Widest support. **← we use this.** |
| **Document PiP** (`documentPictureInPicture`) | Chromium 116+ only | Can host arbitrary DOM, but not available in Safari/Firefox. |

Because a Pomodoro timer is dynamic (a live countdown + progress ring), we paint it onto a
`<canvas>`, capture that canvas as a `MediaStream`, and feed it to a `<video>`. This gives us
the broad compatibility of the video API with fully custom visuals.

---

## 2. Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│  useTimerStore (Zustand)                                                 │
│    timeRemaining · sessionType · isRunning · isPaused · durations        │
└───────────────┬────────────────────────────────────────────────────────┘
                │ getState() every 250 ms
                ▼
┌───────────────────────────┐   captureStream(30)   ┌──────────────────────┐
│  <canvas> (off-screen)     │ ────────────────────► │  <video> (hidden)     │
│  drawFrame():              │      MediaStream       │  muted, playsInline   │
│   • progress ring          │                        └─────────┬────────────┘
│   • MM:SS countdown        │                                  │ requestPictureInPicture()
│   • session label + status │                                  ▼
└───────────────────────────┘                        ┌──────────────────────┐
                                                      │  OS floating PiP window│
                                                      └──────────────────────┘
```

### Key files

| File | Responsibility |
|------|----------------|
| [`hooks/usePictureInPicture.ts`](../hooks/usePictureInPicture.ts) | Core hook — canvas rendering, stream capture, enter/exit PiP, lifecycle cleanup. |
| [`components/pomodoro/Timer.tsx`](../components/pomodoro/Timer.tsx) | Renders the PiP toggle button and wires it to the hook. |
| [`stores/timer-store.ts`](../stores/timer-store.ts) | Single source of truth the canvas reads from. |

---

## 3. Runtime flow

### 3.1 Enter PiP (`togglePip` → `enterPip`)

1. **Guard** — abort if `document.pictureInPictureEnabled` is falsy (unsupported browser).
2. **Create canvas** (640×360) and paint the first frame from the current store state.
3. **Create hidden `<video>`** (`muted`, `playsInline`, positioned off-screen) and append to `document.body`.
4. **Capture stream** — `canvas.captureStream(30)` → assign to `video.srcObject`.
5. **Play & request PiP** — `await video.play()` then `await video.requestPictureInPicture()`.
6. **Start a 250 ms paint loop** (`setInterval`) that re-reads `useTimerStore.getState()` and repaints, keeping the countdown in sync and the stream alive.
7. Set `isPipActive = true`.

### 3.2 Live rendering (`paint` → `drawFrame`)

Every 250 ms the canvas is redrawn with:

- A **progress ring** whose fill = `(totalDuration − timeRemaining) / totalDuration`.
- The **MM:SS** countdown (via `formatTime`).
- The **session label** (`Focus Session` / `Short Break` / `Long Break`) + color.
- A **status line**: `In progress` · `⏸ Paused` · `✓ Completed` · `Ready`.

Colors are keyed off `sessionType` (red / green / blue), mirroring the on-page timer.

### 3.3 Exit PiP (`exitPip`)

Triggered either by the toggle button or the OS window's native close button
(`leavepictureinpicture` event). Both paths run `cleanup()`:

1. Clear the paint `setInterval`.
2. Stop every `MediaStreamTrack`.
3. Detach and remove the `<video>` element.
4. `document.exitPictureInPicture()` if still active.
5. Set `isPipActive = false`.

The hook also runs `cleanup()` on component unmount to avoid leaked streams.

---

## 4. Accuracy while the tab is hidden

PiP shines when the tab is in the background — which is exactly when browsers throttle
timers. Two design choices keep the countdown correct:

- The store's `tick()` is **timestamp-based**: it computes elapsed seconds from
  `Date.now() - lastTickAt`, so even a throttled interval self-corrects on its next fire.
- The paint loop simply reflects `getState()`, so the PiP window always shows the
  corrected value.

---

## 5. Public hook API

```ts
const {
  isSupported,   // boolean  — browser supports PiP
  isPipActive,   // boolean  — floating window currently open
  togglePip,     // ()   => void   — open if closed, close if open
  enterPip,      // () => Promise  — open explicitly
  exitPip,       // () => Promise  — close explicitly
} = usePictureInPicture();
```

The button is only rendered when `isSupported` is `true`, so unsupported browsers
degrade gracefully (no broken control shown).

---

## 6. Browser support & limitations

- ✅ Chrome / Edge / Opera (desktop & Android), Safari (desktop & iOS 14+).
- ❌ Firefox — does not implement `requestPictureInPicture`; button is hidden.
- The floating window is **display-only** (no interactive buttons inside it — the video PiP
  surface cannot host DOM controls). Users control the timer from the main tab.
- Entering PiP is a **user-gesture-gated** action (must be called from a click handler),
  which is why it is bound to the button and not triggered automatically.

---

## 7. Manual test checklist

1. Start a Focus session → click the PiP button → floating window shows the ring counting down.
2. Switch to another app/tab → the floating countdown keeps ticking accurately.
3. Pause on the main tab → PiP status flips to `⏸ Paused` and the number freezes.
4. Resume → countdown continues.
5. Let a session reach 0 → PiP shows `✓ Completed`.
6. Close the PiP window from its native ✕ → button returns to inactive state, no console errors.
7. Open on Firefox → PiP button is absent (graceful degradation).
