"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Smile, RefreshCw, Quote } from "lucide-react";

const JOKES = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "Why did the scarecrow win an award? He was outstanding in his field!",
  "Why don't eggs tell jokes? They'd crack each other up!",
  "What do you call a fake noodle? An impasta!",
  "Why did the math book look so sad? Because it had too many problems!",
  "What's the best thing about Switzerland? I don't know, but the flag is a big plus!",
  "Why don't programmers like nature? It has too many bugs!",
  "How do you comfort a JavaScript bug? You console it!",
];

const QUOTES = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
  },
  {
    text: "Life is what happens to you while you're busy making other plans.",
    author: "John Lennon",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
];

export function JokesQuotes() {
  const [mode, setMode] = useState<"jokes" | "quotes">("jokes");
  const [currentIndex, setCurrentIndex] = useState(0);
  const isJokeMode = mode === "jokes";
  const currentJoke = isJokeMode ? JOKES[currentIndex] : null;
  const currentQuote = !isJokeMode ? QUOTES[currentIndex] : null;

  const getNext = () => {
    const max = mode === "jokes" ? JOKES.length : QUOTES.length;
    setCurrentIndex((prev) => (prev + 1) % max);
  };

  const getRandom = useCallback(() => {
    const max = mode === "jokes" ? JOKES.length : QUOTES.length;
    setCurrentIndex(Math.floor(Math.random() * max));
  }, [mode]);

  useEffect(() => {
    const interval = setInterval(() => {
      getRandom();
    }, 30000);
    return () => clearInterval(interval);
  }, [getRandom]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {mode === "jokes" ? (
            <Smile className="w-5 h-5 text-primary-400" />
          ) : (
            <Quote className="w-5 h-5 text-primary-400" />
          )}
          {mode === "jokes" ? "Jokes" : "Motivational Quotes"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setMode("jokes");
              setCurrentIndex(0);
            }}
            className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
              mode === "jokes"
                ? "bg-primary-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            Jokes
          </button>
          <button
            onClick={() => {
              setMode("quotes");
              setCurrentIndex(0);
            }}
            className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
              mode === "quotes"
                ? "bg-primary-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            Quotes
          </button>
        </div>

        <div className="min-h-[120px] flex items-center justify-center p-6 bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-lg border border-primary-500/20">
          {isJokeMode ? (
            <p className="text-white text-center text-lg">{currentJoke}</p>
          ) : (
            <div className="text-center space-y-2">
              <Quote className="w-8 h-8 text-primary-400 mx-auto opacity-50" />
              <p className="text-white text-lg italic">
                &quot;{currentQuote?.text}&quot;
              </p>
              <p className="text-gray-400 text-sm">— {currentQuote?.author}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={getNext} variant="ghost" className="flex-1">
            Next
          </Button>
          <Button
            onClick={getRandom}
            variant="ghost"
            className="flex-1 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Random
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
