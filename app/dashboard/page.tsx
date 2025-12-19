"use client";

import { Timer } from "@/components/pomodoro/Timer";
import { TaskList } from "@/components/tasks/TaskList";
import { SpotifyPlayer } from "@/components/spotify/Player";
import { Statistics } from "@/components/dashboard/Statistics";
import { DailyGoals } from "@/components/dashboard/DailyGoals";
import { PomodoroHistory } from "@/components/history/PomodoroHistory";
import { Achievements } from "@/components/achievements/Achievements";
import { BreakSuggestions } from "@/components/breaks/BreakSuggestions";
import { BreathingExercise } from "@/components/entertainment/BreathingExercise";
import { MiniGames } from "@/components/entertainment/MiniGames";
import { JokesQuotes } from "@/components/entertainment/JokesQuotes";
import { RelaxingSounds } from "@/components/entertainment/RelaxingSounds";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { FocusMode } from "@/components/pomodoro/FocusMode";
import { KeyboardShortcuts } from "@/components/ui/KeyboardShortcuts";
import { Sidebar } from "@/components/layout/Sidebar";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useTimerStore } from "@/stores/timer-store";
import { useTaskStore } from "@/stores/task-store";
import { Target, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { selectedTask } = useTaskStore();
  useKeyboardShortcuts();

  const [vnNow, setVnNow] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const updateTime = () => {
      setVnNow(
        new Intl.DateTimeFormat("vi-VN", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Ho_Chi_Minh",
        }).format(new Date())
      );
    };

    updateTime();
    const id = setInterval(updateTime, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex lg:pl-72">
      {/* Sidebar Menu */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Background decoration */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 flex-1">
          {/* Header */}
          <div id="dashboard" className="scroll-mt-8">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Welcome back!
              </h1>
              <p className="text-gray-400 text-base sm:text-lg">
                Ready to focus? Let&apos;s get started.
              </p>
              {isMounted && (
                <p className="text-sm text-primary-300 font-medium">
                  Giờ Việt Nam: {vnNow}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Timer Section */}
            <div className="lg:col-span-2 space-y-5 sm:space-y-6">
              <div id="timer" className="scroll-mt-8">
                <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800/50 shadow-2xl">
                  <CardContent className="py-12">
                    <Timer />
                  </CardContent>
                </Card>
              </div>

              {selectedTask && (
                <Card className="bg-gradient-to-r from-primary-500/10 to-purple-500/10 border-primary-500/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary-400" />
                      Current Task
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {selectedTask.title}
                    </h3>
                    {selectedTask.description && (
                      <p className="text-gray-300">
                        {selectedTask.description}
                      </p>
                    )}
                    {selectedTask.estimatedPomodoros > 0 && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                        <Sparkles className="w-4 h-4" />
                        <span>
                          {selectedTask.completedPomodoros} /{" "}
                          {selectedTask.estimatedPomodoros} pomodoros completed
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <div id="tasks" className="scroll-mt-8">
                <TaskList />
              </div>

              {/* Entertainment Section */}
              <div id="entertainment" className="scroll-mt-8 space-y-4">
                <h2 className="text-lg font-semibold text-white px-2">
                  Entertainment & Relaxation
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div id="breathing" className="scroll-mt-8">
                    <BreathingExercise />
                  </div>
                  <div id="games" className="scroll-mt-8">
                    <MiniGames />
                  </div>
                  <div id="jokes" className="scroll-mt-8">
                    <JokesQuotes />
                  </div>
                  <div id="sounds" className="scroll-mt-8">
                  <Statistics />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-5 sm:space-y-6">
              <div id="statistics" className="scroll-mt-8">
                
                <RelaxingSounds />
              </div>
              <DailyGoals />
              <div id="history" className="scroll-mt-8">
                <PomodoroHistory />
              </div>
              <div id="achievements" className="scroll-mt-8">
                <Achievements />
              </div>
              <div id="break-suggestions" className="scroll-mt-8">
                <BreakSuggestions />
              </div>
              <div id="spotify" className="scroll-mt-8">
                <SpotifyPlayer />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel />

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts />

      {/* Focus Mode */}
      <FocusMode />
    </div>
  );
}
