"use client";

import { Timer } from "@/components/pomodoro/Timer";
import { TaskList } from "@/components/tasks/TaskList";
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
import { CalendarDays, Sparkles, Target } from "lucide-react";
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
        }).format(new Date()),
      );
    };

    updateTime();
    const id = setInterval(updateTime, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-gray-900 dark:bg-gray-950 dark:text-white lg:pl-72">
      <Sidebar />

      <main className="min-h-screen">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 pb-10 pt-24 sm:px-6 lg:px-8 lg:pt-8">
          <section
            id="dashboard"
            className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:p-6"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-950 dark:text-white sm:text-4xl">
                  Welcome back!
                </h1>
                <p className="text-base text-gray-600 dark:text-gray-400 sm:text-lg">
                  Ready to focus? Let&apos;s get started.
                </p>
              </div>
              {isMounted && (
                <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700 dark:border-primary-900/60 dark:bg-gray-950/40 dark:text-primary-300">
                  <CalendarDays className="h-4 w-4" />
                  <span>Giờ Việt Nam: {vnNow}</span>
                </div>
              )}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
            <div className="space-y-6">
              <div id="timer" className="scroll-mt-24">
                <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <CardContent className="px-0 py-6 sm:px-4 sm:py-8 lg:py-10">
                    <Timer />
                  </CardContent>
                </Card>
              </div>

              {selectedTask && (
                <Card className="border-primary-200 bg-primary-50 dark:border-primary-900/60 dark:bg-gray-950/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary-400" />
                      Current Task
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      {selectedTask.title}
                    </h3>
                    {selectedTask.description && (
                      <p className="text-gray-600 dark:text-gray-300">
                        {selectedTask.description}
                      </p>
                    )}
                    {selectedTask.estimatedPomodoros > 0 && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
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

              <div id="tasks" className="scroll-mt-24">
                <TaskList />
              </div>

              <div id="entertainment" className="scroll-mt-24 space-y-4">
                <h2 className="px-1 text-lg font-semibold text-gray-800 dark:text-white">
                  Entertainment & Relaxation
                </h2>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                  <div id="breathing" className="scroll-mt-24">
                    <BreathingExercise />
                  </div>
                  <div id="games" className="scroll-mt-24">
                    <MiniGames />
                  </div>
                  <div id="jokes" className="scroll-mt-24">
                    <JokesQuotes />
                  </div>
                  <div id="sounds" className="scroll-mt-24">
                    <RelaxingSounds />
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div id="statistics" className="scroll-mt-24">
                <Statistics />
              </div>
              <DailyGoals />
              <div id="history" className="scroll-mt-24">
                <PomodoroHistory />
              </div>
              <div id="achievements" className="scroll-mt-24">
                <Achievements />
              </div>
              <div id="break-suggestions" className="scroll-mt-24">
                <BreakSuggestions />
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Settings Panel */}
      <SettingsPanel />

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts />

      {/* Focus Mode */}
      <FocusMode />
    </div>
  );
}
