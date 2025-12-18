"use client";

import { useEffect } from "react";
import { useTimerStore } from "@/stores/timer-store";
import { useUIStore } from "@/stores/ui-store";
import { Timer } from "./Timer";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

export function FocusMode() {
  const { isRunning, sessionType } = useTimerStore();
  const { focusMode, setFocusMode } = useUIStore();

  useEffect(() => {
    if (isRunning && !focusMode) {
      setFocusMode(true);
    }
  }, [isRunning, focusMode, setFocusMode]);

  if (!focusMode) return null;

  const sessionColors = {
    FOCUS: "from-red-950 via-gray-950 to-gray-950",
    SHORT_BREAK: "from-green-950 via-gray-950 to-gray-950",
    LONG_BREAK: "from-blue-950 via-gray-950 to-gray-950",
  };

  return (
    <AnimatePresence>
      {focusMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-50 bg-gradient-to-br ${sessionColors[sessionType]} flex items-center justify-center`}
        >
          {/* Exit button */}
          <Button
            onClick={() => setFocusMode(false)}
            variant="ghost"
            className="absolute top-6 right-6 text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Timer in focus mode */}
          <div className="max-w-4xl w-full px-8">
            <Timer />
          </div>

          {/* Keyboard hint */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm">
            Press ESC to exit focus mode
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
