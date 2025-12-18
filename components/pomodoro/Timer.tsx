"use client";

import { usePomodoro } from "@/hooks/usePomodoro";
import { useTimerStore } from "@/stores/timer-store";
import { useUIStore } from "@/stores/ui-store";
import { formatTime } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, RotateCcw, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";

export function Timer() {
  const {
    timeRemaining,
    isRunning,
    isPaused,
    sessionType,
    start,
    pause,
    resume,
    skip,
  } = usePomodoro();

  const {
    setSessionType,
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    setCurrentSessionId,
  } = useTimerStore();
  const { setFocusMode } = useUIStore();
  const [progress, setProgress] = useState(0);

  const totalDurationMap = {
    FOCUS: focusDuration,
    SHORT_BREAK: shortBreakDuration,
    LONG_BREAK: longBreakDuration,
  } as const;
  const totalDuration = totalDurationMap[sessionType];
  const percentage = ((totalDuration - timeRemaining) / totalDuration) * 100;

  useEffect(() => {
    setProgress(percentage);
  }, [percentage]);

  const handleStart = () => {
    start();

    // Fire-and-forget API to register session id (optional, won't block timer)
    fetch("/api/pomodoro/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: sessionType }),
    })
      .then(async (res) => {
        if (!res.ok) {
          console.error("Failed to start session via API", await res.text());
          return;
        }
        const session = await res.json();
        setCurrentSessionId(session.id);
      })
      .catch((err) => {
        console.error("Error starting session:", err);
      });
  };

  const handlePause = () => {
    pause();
  };

  const handleResume = () => {
    resume();
  };

  const handleSkip = async () => {
    skip();
  };

  const handleReset = () => {
    setSessionType("FOCUS");
  };

  const sessionColors = {
    FOCUS: {
      bg: "from-red-500/20 to-orange-500/20",
      ring: "ring-red-500/50",
      text: "text-red-400",
      progress: "#ef4444",
    },
    SHORT_BREAK: {
      bg: "from-green-500/20 to-emerald-500/20",
      ring: "ring-green-500/50",
      text: "text-green-400",
      progress: "#10b981",
    },
    LONG_BREAK: {
      bg: "from-blue-500/20 to-cyan-500/20",
      ring: "ring-blue-500/50",
      text: "text-blue-400",
      progress: "#3b82f6",
    },
  };

  const sessionLabels = {
    FOCUS: "Focus Session",
    SHORT_BREAK: "Short Break",
    LONG_BREAK: "Long Break",
  };

  const currentColor = sessionColors[sessionType];

  // Calculate circle circumference
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* Session Type Selector */}
      <div className="flex gap-2 bg-gray-800/50 p-1 rounded-xl">
        {(["FOCUS", "SHORT_BREAK", "LONG_BREAK"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setSessionType(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              sessionType === type
                ? "bg-primary-600 text-white shadow-lg shadow-primary-600/50"
                : "text-gray-400 hover:text-white hover:bg-gray-700/50"
            }`}
          >
            {sessionLabels[type]}
          </button>
        ))}
      </div>

      {/* Circular Progress Timer */}
      <div className="relative">
        <div
          className={`relative w-80 h-80 rounded-full bg-gradient-to-br ${currentColor.bg} p-4`}
        >
          <svg
            className="transform -rotate-90 w-full h-full"
            viewBox="0 0 300 300"
          >
            {/* Background circle */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-800"
            />
            {/* Progress circle */}
            <motion.circle
              cx="150"
              cy="150"
              r={radius}
              stroke={currentColor.progress}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="drop-shadow-lg"
            />
          </svg>

          {/* Timer Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={timeRemaining}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`text-6xl font-bold ${currentColor.text} mb-2`}
              >
                {formatTime(timeRemaining)}
              </motion.div>
            </AnimatePresence>
            <p className={`text-lg ${currentColor.text} opacity-80`}>
              {sessionLabels[sessionType]}
            </p>
          </div>
        </div>

        {/* Pulsing ring when running */}
        {isRunning && (
          <motion.div
            className={`absolute inset-0 rounded-full ${currentColor.ring}`}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ boxShadow: `0 0 0 4px currentColor` }}
          />
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3 items-center">
        {!isRunning && !isPaused && (
          <>
            <Button
              onClick={handleStart}
              size="lg"
              className="flex items-center gap-2 px-8 shadow-lg shadow-primary-600/50 hover:shadow-primary-600/70"
            >
              <Play className="w-5 h-5" />
              Start
            </Button>
            <Button
              onClick={() => setFocusMode(true)}
              variant="ghost"
              size="lg"
              className="flex items-center gap-2"
              title="Enter Focus Mode (Ctrl+F)"
            >
              <Maximize2 className="w-5 h-5" />
            </Button>
          </>
        )}

        {isRunning && (
          <Button
            onClick={handlePause}
            size="lg"
            variant="secondary"
            className="flex items-center gap-2 px-8"
          >
            <Pause className="w-5 h-5" />
            Pause
          </Button>
        )}

        {isPaused && (
          <>
            <Button
              onClick={handleResume}
              size="lg"
              className="flex items-center gap-2 px-8 shadow-lg shadow-primary-600/50"
            >
              <Play className="w-5 h-5" />
              Resume
            </Button>
            <Button
              onClick={handleSkip}
              size="lg"
              variant="ghost"
              className="flex items-center gap-2"
            >
              <SkipForward className="w-5 h-5" />
              Skip
            </Button>
            <Button
              onClick={handleReset}
              size="lg"
              variant="ghost"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
