"use client";

import { useCallback, useEffect, useState } from "react";
import { useTaskStore } from "@/stores/task-store";
import { TaskCard } from "./TaskCard";
import { TaskForm } from "./TaskForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, Filter } from "lucide-react";
import { Task } from "@/types/task";

export function TaskList() {
  const { tasks, isLoading, setTasks, setLoading } = useTaskStore();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<
    "ALL" | "TODO" | "IN_PROGRESS" | "COMPLETED"
  >("ALL");

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/tasks");
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleSave = () => {
    fetchTasks();
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "ALL") return true;
    return task.status === filter;
  });

  if (isLoading) {
    return (
      <Card>
        <div className="text-center py-12 text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          Loading tasks...
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-white">Tasks</h2>
            <Button
              onClick={handleCreateTask}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              New Task
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-gray-800">
            {(["ALL", "TODO", "IN_PROGRESS", "COMPLETED"] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                    filter === status
                      ? "border-primary-600 text-primary-400"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  {status === "ALL" ? "All" : status.replace("_", " ")}
                </button>
              )
            )}
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="mb-2">
                {filter === "ALL"
                  ? "No tasks yet. Create your first task to get started!"
                  : `No ${filter.toLowerCase().replace("_", " ")} tasks.`}
              </p>
              {filter !== "ALL" && (
                <Button
                  onClick={handleCreateTask}
                  variant="ghost"
                  size="sm"
                  className="mt-4"
                >
                  Create one now
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => handleEditTask(task)}
                />
              ))}
            </div>
          )}
        </div>
      </Card>

      {showForm && (
        <TaskForm
          task={editingTask}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
          onSave={handleSave}
        />
      )}
    </>
  );
}
