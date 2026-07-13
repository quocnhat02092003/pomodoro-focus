"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { TrendingUp, Clock, Target, Flame } from "lucide-react";
import { useEffect, useState } from "react";

interface Stats {
  todayPomodoros: number;
  todayFocusMinutes: number;
  streak: number;
  weeklyGoal: number;
  weeklyCompleted: number;
}

export function Statistics() {
  const [stats, setStats] = useState<Stats>({
    todayPomodoros: 0,
    todayFocusMinutes: 0,
    streak: 0,
    weeklyGoal: 20,
    weeklyCompleted: 0,
  });

  useEffect(() => {
    // Fetch stats from API (would need to create this endpoint)
    // For now, using mock data
    setStats({
      todayPomodoros: 4,
      todayFocusMinutes: 100,
      streak: 7,
      weeklyGoal: 20,
      weeklyCompleted: 15,
    });
  }, []);

  const weeklyProgress = (stats.weeklyCompleted / stats.weeklyGoal) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-400" />
          Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Today's Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-primary-200 bg-primary-50 p-4 dark:border-primary-900/60 dark:bg-gray-950/30">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary-400" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Today</p>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.todayPomodoros}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              pomodoros
            </p>
          </div>

          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/60 dark:bg-green-950/30">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-green-400" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Focus Time
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.todayFocusMinutes}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">minutes</p>
          </div>
        </div>

        {/* Streak */}
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900/60 dark:bg-orange-950/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Current Streak
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {stats.streak} days
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Keep it up!
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Goal */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Weekly Goal
              </p>
            </div>
            <p className="text-sm font-medium text-gray-800 dark:text-white">
              {stats.weeklyCompleted} / {stats.weeklyGoal}
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-primary-600 transition-all duration-500"
              style={{ width: `${Math.min(weeklyProgress, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
