// Web Worker for Pomodoro timer
// Runs in background thread to keep timer accurate even when tab is inactive

let intervalId: ReturnType<typeof setInterval> | null = null
let timeRemaining = 0
let isRunning = false

self.addEventListener('message', (e) => {
  const { type, payload } = e.data

  switch (type) {
    case 'START':
      timeRemaining = payload.timeRemaining
      isRunning = true
      
      if (intervalId) {
        clearInterval(intervalId)
      }
      
      intervalId = setInterval(() => {
        if (isRunning && timeRemaining > 0) {
          timeRemaining--
          self.postMessage({
            type: 'TICK',
            payload: { timeRemaining },
          })
          
          if (timeRemaining === 0) {
            isRunning = false
            if (intervalId) {
              clearInterval(intervalId)
              intervalId = null
            }
            self.postMessage({
              type: 'COMPLETE',
            })
          }
        }
      }, 1000)
      break

    case 'PAUSE':
      isRunning = false
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
      break

    case 'RESUME':
      isRunning = true
      if (!intervalId) {
        intervalId = setInterval(() => {
          if (isRunning && timeRemaining > 0) {
            timeRemaining--
            self.postMessage({
              type: 'TICK',
              payload: { timeRemaining },
            })
            
            if (timeRemaining === 0) {
              isRunning = false
              if (intervalId) {
                clearInterval(intervalId)
                intervalId = null
              }
              self.postMessage({
                type: 'COMPLETE',
              })
            }
          }
        }, 1000)
      }
      break

    case 'STOP':
      isRunning = false
      timeRemaining = 0
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
      break

    case 'SET_TIME':
      timeRemaining = payload.timeRemaining
      break

    default:
      break
  }
})

