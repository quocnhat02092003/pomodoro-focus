"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Task } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { X, Save } from "lucide-react";
import { PRIORITY_COLORS } from "@/lib/constants";
import { useTaskStore } from "@/stores/task-store";

interface TaskFormProps {
  task?: Task | null;
  onClose: () => void;
  onSave: () => void;
}

export function TaskForm({ task, onClose, onSave }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<
    "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  >("MEDIUM");
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1);
  const [dueDate, setDueDate] = useState("");
  const { setLoading } = useTaskStore();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority);
      setEstimatedPomodoros(task.estimatedPomodoros || 1);
      setDueDate(
        task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
      );
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = task ? `/api/tasks/${task.id}` : "/api/tasks";
      const method = task ? "PATCH" : "POST";

      const body: any = {
        title,
        description,
        priority,
        estimatedPomodoros,
      };

      if (dueDate) {
        body.dueDate = new Date(dueDate).toISOString();
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        onSave();
        onClose();
      }
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl"
      >
        <Card className="relative">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{task ? "Edit Task" : "New Task"}</CardTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="What needs to be done?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="Add more details..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {Object.entries(PRIORITY_COLORS).map(([key, color]) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estimated Pomodoros
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={estimatedPomodoros}
                    onChange={(e) =>
                      setEstimatedPomodoros(parseInt(e.target.value) || 1)
                    }
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex flex-wrap justify-end gap-3 pt-4">
                <Button type="button" onClick={onClose} variant="ghost">
                  Cancel
                </Button>
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {task ? "Update" : "Create"} Task
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
