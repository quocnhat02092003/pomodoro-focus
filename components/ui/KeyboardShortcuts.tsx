'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Keyboard } from 'lucide-react'
import { useState } from 'react'
import { Modal } from './Modal'

const shortcuts = [
  { keys: ['Space'], description: 'Start / Pause / Resume timer' },
  { keys: ['S'], description: 'Skip current session' },
  { keys: ['1'], description: 'Switch to Focus session' },
  { keys: ['2'], description: 'Switch to Short Break' },
  { keys: ['3'], description: 'Switch to Long Break' },
  { keys: ['Ctrl', 'F'], description: 'Toggle Focus Mode' },
  { keys: ['Esc'], description: 'Exit Focus Mode' },
]

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 rounded-full w-14 h-14 shadow-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
        title="Keyboard Shortcuts"
      >
        <Keyboard className="w-6 h-6" />
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Keyboard Shortcuts" size="md">
        <div className="space-y-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <kbd
                    key={keyIndex}
                    className="px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  )
}


