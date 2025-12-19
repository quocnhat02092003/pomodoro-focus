"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Gamepad2, RotateCcw } from "lucide-react";

type GameType = "tic-tac-toe" | "memory";

function TicTacToe() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0, ties: 0 });

  const calculateWinner = (squares: (string | null)[]): string | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || calculateWinner(board)) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every((cell) => cell !== null);

  useEffect(() => {
    if (winner) {
      setScore((prev) => ({
        ...prev,
        [winner]: prev[winner as "X" | "O"] + 1,
      }));
    } else if (isDraw) {
      setScore((prev) => ({ ...prev, ties: prev.ties + 1 }));
    }
  }, [winner, isDraw]);

  const reset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">Score</div>
        <div className="flex gap-4 text-sm">
          <span className="text-blue-400">X: {score.X}</span>
          <span className="text-gray-500 dark:text-gray-400">Ties: {score.ties}</span>
          <span className="text-red-400">O: {score.O}</span>
        </div>
      </div>

      <div className="text-center">
        {winner ? (
          <p className="text-lg font-bold text-primary-400">
            Winner: {winner}!
          </p>
        ) : isDraw ? (
          <p className="text-lg font-bold text-gray-500 dark:text-gray-400">It&apos;s a draw!</p>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            Next:{" "}
            <span className={isXNext ? "text-blue-400" : "text-red-400"}>
              {isXNext ? "X" : "O"}
            </span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            disabled={!!cell || !!winner}
            className={`aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg text-2xl font-bold transition-all ${cell === "X"
                ? "text-blue-400 hover:bg-blue-500/20"
                : cell === "O"
                  ? "text-red-400 hover:bg-red-500/20"
                  : "hover:bg-gray-300 dark:hover:bg-gray-700 text-transparent"
              } disabled:cursor-not-allowed`}
          >
            {cell || "·"}
          </button>
        ))}
      </div>

      <Button onClick={reset} variant="ghost" size="sm" className="w-full">
        <RotateCcw className="w-4 h-4 mr-2" />
        New Game
      </Button>
    </div>
  );
}

function MemoryGame() {
  const [cards, setCards] = useState<number[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const initializeGame = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
    const pairs = [...numbers, ...numbers];
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameStarted(true);
  };

  const handleCardClick = (index: number) => {
    if (
      flipped.length === 2 ||
      flipped.includes(index) ||
      matched.includes(index)
    )
      return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const isComplete = matched.length === cards.length && cards.length > 0;

  return (
    <div className="space-y-4">
      {!gameStarted ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Match all pairs!</p>
          <Button onClick={initializeGame}>Start Game</Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Moves: {moves}</span>
            {isComplete && (
              <span className="text-sm text-green-400 font-bold">
                Completed!
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {cards.map((card, index) => {
              const isFlipped =
                flipped.includes(index) || matched.includes(index);
              return (
                <button
                  key={index}
                  onClick={() => handleCardClick(index)}
                  disabled={matched.includes(index)}
                  className={`aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg text-xl font-bold transition-all ${isFlipped
                      ? "bg-primary-600 text-white"
                      : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-transparent"
                    } disabled:opacity-50`}
                >
                  {isFlipped ? card : "?"}
                </button>
              );
            })}
          </div>
          <Button
            onClick={initializeGame}
            variant="ghost"
            size="sm"
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </>
      )}
    </div>
  );
}

export function MiniGames() {
  const [gameType, setGameType] = useState<GameType>("tic-tac-toe");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-primary-400" />
          Mini Games
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setGameType("tic-tac-toe")}
            className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${gameType === "tic-tac-toe"
                ? "bg-primary-600 text-white"
                : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
          >
            Tic-Tac-Toe
          </button>
          <button
            onClick={() => setGameType("memory")}
            className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${gameType === "memory"
                ? "bg-primary-600 text-white"
                : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
          >
            Memory
          </button>
        </div>

        <div className="pt-4">
          {gameType === "tic-tac-toe" ? <TicTacToe /> : <MemoryGame />}
        </div>
      </CardContent>
    </Card>
  );
}
