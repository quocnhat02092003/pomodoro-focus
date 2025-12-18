"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Coffee, Eye, StretchHorizontal, BookOpen, Music } from "lucide-react";

interface BreakActivity {
  icon: React.ReactNode;
  title: string;
  description: string;
  duration: string;
}

const activities: BreakActivity[] = [
  {
    icon: <Coffee className="w-5 h-5" />,
    title: "Get a Drink",
    description: "Stay hydrated with water or enjoy a cup of tea",
    duration: "2-3 min",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: "Eye Exercise",
    description: "Look away from screen, focus on distant objects",
    duration: "1-2 min",
  },
  {
    icon: <StretchHorizontal className="w-5 h-5" />,
    title: "Stretch",
    description: "Do some light stretching to relax your muscles",
    duration: "3-5 min",
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    title: "Read",
    description: "Read a few pages of a book or article",
    duration: "5-10 min",
  },
  {
    icon: <Music className="w-5 h-5" />,
    title: "Listen to Music",
    description: "Enjoy some relaxing music or a podcast",
    duration: "5-15 min",
  },
];

export function BreakSuggestions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coffee className="w-5 h-5 text-primary-400" />
          Break Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer group"
            >
              <div className="text-primary-400 group-hover:text-primary-300 transition-colors">
                {activity.icon}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <h4 className="font-medium text-white text-sm">
                    {activity.title}
                  </h4>
                  <span className="text-xs text-gray-400">
                    {activity.duration}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
