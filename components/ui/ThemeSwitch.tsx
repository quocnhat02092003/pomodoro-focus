'use client'

import { useTheme } from '@/hooks/useTheme'
import { Sun, Moon } from 'lucide-react'

interface ThemeSwitchProps {
    showLabel?: boolean
}

export function ThemeSwitch({ showLabel = true }: ThemeSwitchProps) {
    const { theme, toggleTheme, mounted } = useTheme()

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="flex items-center justify-between p-3 bg-gray-200 dark:bg-gray-800 rounded-lg">
                {showLabel && <span className="text-gray-800 dark:text-white">Theme</span>}
                <div className="w-16 h-8 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </div>
        )
    }

    const isDark = theme === 'dark'

    return (
        <div className="flex items-center justify-between p-3 bg-gray-200 dark:bg-gray-800 rounded-lg">
            {showLabel && (
                <div className="flex items-center gap-2">
                    {isDark ? (
                        <Moon className="w-5 h-5 text-primary-400" />
                    ) : (
                        <Sun className="w-5 h-5 text-yellow-500" />
                    )}
                    <span className="text-gray-800 dark:text-white">
                        {isDark ? 'Dark Mode' : 'Light Mode'}
                    </span>
                </div>
            )}

            {/* Premium Toggle Switch */}
            <button
                onClick={toggleTheme}
                className={`
          relative w-16 h-8 rounded-full p-1
          transition-all duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
          ${isDark
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600'
                        : 'bg-gradient-to-r from-yellow-400 to-orange-400'
                    }
        `}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
                {/* Background stars/rays effect */}
                <div className={`
          absolute inset-0 rounded-full overflow-hidden
          transition-opacity duration-300
          ${isDark ? 'opacity-100' : 'opacity-0'}
        `}>
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-0.5 h-0.5 bg-white/50 rounded-full animate-pulse"
                            style={{
                                top: `${20 + Math.random() * 60}%`,
                                left: `${10 + Math.random() * 30}%`,
                                animationDelay: `${i * 0.3}s`
                            }}
                        />
                    ))}
                </div>

                {/* Toggle circle */}
                <div
                    className={`
            relative w-6 h-6 rounded-full
            transform transition-all duration-300 ease-in-out
            flex items-center justify-center
            shadow-lg
            ${isDark
                            ? 'translate-x-8 bg-gray-900'
                            : 'translate-x-0 bg-white'
                        }
          `}
                >
                    {/* Icon inside toggle */}
                    {isDark ? (
                        <Moon className="w-4 h-4 text-indigo-300" />
                    ) : (
                        <Sun className="w-4 h-4 text-yellow-500" />
                    )}

                    {/* Glow effect */}
                    <div className={`
            absolute inset-0 rounded-full
            transition-all duration-300
            ${isDark
                            ? 'shadow-[0_0_10px_rgba(129,140,248,0.5)]'
                            : 'shadow-[0_0_10px_rgba(250,204,21,0.5)]'
                        }
          `} />
                </div>
            </button>
        </div>
    )
}
