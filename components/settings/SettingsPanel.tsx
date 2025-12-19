"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { Settings, Volume2, Bell, Clock, Zap, Palette } from "lucide-react";
import { useTimerStore } from "@/stores/timer-store";
import { useSound } from "@/hooks/useSound";

interface SettingsData {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

export function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    soundEnabled: true,
    notificationsEnabled: true,
    autoStartBreaks: false,
    autoStartPomodoros: false,
  });

  const {
    autoStartBreaks,
    autoStartPomodoros,
    setAutoStartBreaks,
    setAutoStartPomodoros,
    setDurations,
  } = useTimerStore();
  const { playNotification } = useSound();

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem("pomodoro-settings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    setAutoStartBreaks(settings.autoStartBreaks);
    setAutoStartPomodoros(settings.autoStartPomodoros);
    setDurations({
      focus: settings.focusDuration * 60,
      shortBreak: settings.shortBreakDuration * 60,
      longBreak: settings.longBreakDuration * 60,
    });
  }, [
    settings.autoStartBreaks,
    settings.autoStartPomodoros,
    settings.focusDuration,
    settings.shortBreakDuration,
    settings.longBreakDuration,
    setAutoStartBreaks,
    setAutoStartPomodoros,
    setDurations,
  ]);

  const handleSave = () => {
    localStorage.setItem("pomodoro-settings", JSON.stringify(settings));
    setIsOpen(false);
    if (settings.soundEnabled) {
      playNotification("complete");
    }
  };

  const handleTestSound = () => {
    if (settings.soundEnabled) {
      playNotification("complete");
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="ghost"
        className="fixed bottom-6 right-6 z-40 rounded-full w-14 h-14 shadow-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
        title="Settings"
      >
        <Settings className="w-6 h-6" />
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Settings"
        size="lg"
      >
        <div className="space-y-6">
          {/* Timer Durations */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-400" />
              Timer Durations (minutes)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Focus
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.focusDuration}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      focusDuration: parseInt(e.target.value) || 25,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Short Break
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.shortBreakDuration}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      shortBreakDuration: parseInt(e.target.value) || 5,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Long Break
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.longBreakDuration}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      longBreakDuration: parseInt(e.target.value) || 15,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Sound & Notifications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-primary-400" />
              Sound & Notifications
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-800 dark:text-white">Sound Notifications</span>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) =>
                    setSettings({ ...settings, soundEnabled: e.target.checked })
                  }
                  className="w-5 h-5 rounded"
                />
              </label>
              {settings.soundEnabled && (
                <Button
                  onClick={handleTestSound}
                  variant="ghost"
                  size="sm"
                  className="w-full"
                >
                  Test Sound
                </Button>
              )}
              <label className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-800 dark:text-white">Browser Notifications</span>
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notificationsEnabled: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded"
                />
              </label>
            </div>
          </div>

          {/* Appearance */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary-400" />
              Appearance
            </h3>
            <div className="space-y-3">
              <ThemeSwitch />
            </div>
          </div>

          {/* Auto Start */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary-400" />
              Auto Start
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div>
                  <span className="text-gray-800 dark:text-white block">Auto-start Breaks</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Automatically start break after focus session
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoStartBreaks}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      autoStartBreaks: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded"
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div>
                  <span className="text-gray-800 dark:text-white block">Auto-start Pomodoros</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Automatically start focus after break
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoStartPomodoros}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      autoStartPomodoros: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button onClick={() => setIsOpen(false)} variant="ghost">
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Settings</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
