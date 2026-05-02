import { useState, useEffect, useCallback, useRef } from 'react';

interface UseIdleTimeoutOptions {
  timeout?: number; // in milliseconds
  onIdle?: () => void;
  onActive?: () => void;
}

interface UseIdleTimeoutReturn {
  isIdle: boolean;
  timeLeft: number; // in seconds
  resetTimer: () => void;
}

export function useIdleTimeout({
  timeout = 120 * 60 * 1000, // default 120 minutes
  onIdle,
  onActive,
}: UseIdleTimeoutOptions = {}): UseIdleTimeoutReturn {
  const [isIdle, setIsIdle] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeout / 1000);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastActivityRef = useRef(Date.now());
  const isIdleRef = useRef(isIdle);

  // Keep ref in sync
  useEffect(() => {
    isIdleRef.current = isIdle;
  }, [isIdle]);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    clearTimers();
    
    lastActivityRef.current = Date.now();
    isIdleRef.current = false;
    setIsIdle(false);
    setTimeLeft(Math.ceil(timeout / 1000));

    // Set idle timer
    timerRef.current = setTimeout(() => {
      isIdleRef.current = true;
      setIsIdle(true);
      if (onIdle) onIdle();
    }, timeout);

    // Start countdown
    countdownRef.current = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      const remaining = Math.max(0, (timeout - elapsed) / 1000);
      setTimeLeft(Math.ceil(remaining));
    }, 1000);

    if (onActive) onActive();
  }, [timeout, onIdle, onActive, clearTimers]);

  const handleActivity = () => {
    if (!isIdleRef.current) {
      resetTimer();
    }
  };

  useEffect(() => {
    // Events to track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    // Initialize timer
    resetTimer();

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      clearTimers();
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [resetTimer, clearTimers]);

  return { isIdle, timeLeft, resetTimer };
}
