import { useState, useCallback, useRef, useEffect } from 'react';
import { TIMER_MODES } from '../config/constants';

export const useTimer = () => {
  const [mode, setMode] = useState('pomodoro');
  const [pomodoroDuration, setPomodoroDurationState] = useState(TIMER_MODES.pomodoro);
  const [breakDuration, setBreakDurationState] = useState(TIMER_MODES.break);
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES.pomodoro);
  const [customTime, setCustomTimeState] = useState(TIMER_MODES.pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (isRunning) return;
    
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          // Play notification sound
          if (Notification.permission === 'granted') {
            new Notification('Timer Complete!', {
              body: mode === 'pomodoro' ? 'Time for a break!' : 'Break is over, back to work!',
              icon: '/favicon.svg'
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [isRunning, mode, clearTimer]);

  const pause = useCallback(() => {
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const stop = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    if (mode === 'custom') {
      setTimeLeft(customTime);
      return;
    }
    setTimeLeft(mode === 'pomodoro' ? pomodoroDuration : breakDuration);
  }, [clearTimer, mode, customTime, pomodoroDuration, breakDuration]);

  const toggle = useCallback(() => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  }, [isRunning, start, pause]);

  const switchMode = useCallback((newMode) => {
    clearTimer();
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'pomodoro') {
      setTimeLeft(pomodoroDuration);
      return;
    }
    if (newMode === 'break') {
      setTimeLeft(breakDuration);
      return;
    }
    setTimeLeft(customTime);
  }, [clearTimer, pomodoroDuration, breakDuration, customTime]);

  const setCustomTime = useCallback((seconds) => {
    clearTimer();
    setIsRunning(false);
    setMode('custom');
    setTimeLeft(seconds);
    setCustomTimeState(seconds);
  }, [clearTimer]);

  const setPomodoroDuration = useCallback((seconds) => {
    clearTimer();
    setIsRunning(false);
    setPomodoroDurationState(seconds);
    if (mode === 'pomodoro') {
      setTimeLeft(seconds);
    }
  }, [clearTimer, mode]);

  const setBreakDuration = useCallback((seconds) => {
    clearTimer();
    setIsRunning(false);
    setBreakDurationState(seconds);
    if (mode === 'break') {
      setTimeLeft(seconds);
    }
  }, [clearTimer, mode]);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return {
    mode,
    timeLeft,
    pomodoroDuration,
    breakDuration,
    isRunning,
    formattedTime: formatTime(timeLeft),
    start,
    pause,
    stop,
    toggle,
    switchMode,
    setCustomTime,
    setPomodoroDuration,
    setBreakDuration
  };
};

export default useTimer;
