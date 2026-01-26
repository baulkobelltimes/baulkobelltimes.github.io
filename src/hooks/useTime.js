import { useState, useEffect, useCallback, useMemo } from 'react';
import { BELL_TIMES, TIME_SETTINGS, DAYS } from '../config/constants';

export const useTime = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const currentDay = useMemo(() => DAYS[now.getDay()], [now]);
  const isSchoolDay = useMemo(() => Boolean(BELL_TIMES[currentDay]), [currentDay]);

  const timeInMinutes = useMemo(() => {
    return now.getHours() * 60 + now.getMinutes();
  }, [now]);

  const greeting = useMemo(() => {
    if (timeInMinutes >= TIME_SETTINGS.MORNING_START && timeInMinutes < TIME_SETTINGS.AFTERNOON_START) {
      return 'Good morning';
    } else if (timeInMinutes >= TIME_SETTINGS.AFTERNOON_START && timeInMinutes < TIME_SETTINGS.EVENING_START) {
      return 'Good afternoon';
    } else if (timeInMinutes >= TIME_SETTINGS.EVENING_START && timeInMinutes < TIME_SETTINGS.NIGHT_START) {
      return 'Good evening';
    }
    return 'Good night';
  }, [timeInMinutes]);

  const convertTimeToMinutes = useCallback((timeStr) => {
    const [time, meridian] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    if (meridian === 'PM' && hours !== 12) {
      return (hours + 12) * 60 + minutes;
    } else if (meridian === 'AM' && hours === 12) {
      return minutes;
    }
    return hours * 60 + minutes;
  }, []);

  const formatTime = useCallback((date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }, []);

  const getNextPeriod = useCallback((day) => {
    if (!BELL_TIMES[day]) return null;
    
    for (const period of BELL_TIMES[day]) {
      const periodMinutes = convertTimeToMinutes(period.time);
      if (periodMinutes > timeInMinutes) {
        return period;
      }
    }
    return null;
  }, [timeInMinutes, convertTimeToMinutes]);

  const getCountdownInfo = useCallback((day, timetableData) => {
    if (!BELL_TIMES[day]) {
      return { text: 'No school today.', periodDetails: null };
    }

    const currentSeconds = now.getSeconds();
    let nextPeriod = null;
    let timeUntilNextMinutes = Infinity;

    for (const period of BELL_TIMES[day]) {
      const periodMinutes = convertTimeToMinutes(period.time);
      const diffMinutes = periodMinutes - timeInMinutes - 1;

      if (diffMinutes >= 0 && diffMinutes < timeUntilNextMinutes) {
        nextPeriod = period;
        timeUntilNextMinutes = diffMinutes;
      }
    }

    if (!nextPeriod) {
      return { text: 'No more periods today.', periodDetails: null };
    }

    const hours = Math.floor(timeUntilNextMinutes / 60);
    const minutes = timeUntilNextMinutes % 60;
    const seconds = 60 - currentSeconds;
    
    let countdownText = hours > 0 
      ? `${hours}h ${minutes}m`
      : `${minutes}m ${seconds}s`;

    let periodDetails = null;
    if (timetableData?.[day]) {
      const periodKey = getPeriodKey(nextPeriod.name);
      if (periodKey && timetableData[day][periodKey]) {
        const [subject, room] = timetableData[day][periodKey];
        periodDetails = { subject, room };
      }
    }

    if (!periodDetails && /lunch|recess|break|sport/i.test(nextPeriod.name)) {
      periodDetails = { label: nextPeriod.name };
    }

    return {
      text: `Next period in: ${countdownText}`,
      periodDetails,
      nextPeriod
    };
  }, [now, timeInMinutes, convertTimeToMinutes]);

  return {
    now,
    currentDay,
    isSchoolDay,
    timeInMinutes,
    greeting,
    convertTimeToMinutes,
    formatTime,
    getNextPeriod,
    getCountdownInfo
  };
};

const getPeriodKey = (periodName) => {
  if (!periodName) return null;
  const periodMatch = periodName.match(/Period\s+(\d+)/i);
  if (periodMatch) return periodMatch[1];
  if (/^roll\s*call/i.test(periodName)) return '0';
  return null;
};

export default useTime;
