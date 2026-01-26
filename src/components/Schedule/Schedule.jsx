import { useEffect, useRef, useMemo, useCallback } from 'react';
import { Settings } from 'lucide-react';
import { gsap } from 'gsap';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { BELL_TIMES, SCHOOL_DAYS } from '../../config/constants';
import useTime from '../../hooks/useTime';
import './Schedule.css';

const Schedule = ({ 
  selectedDay, 
  onDayChange, 
  timetableData, 
  onOpenSettings,
  showRoom = true,
  showSubject = true
}) => {
  const { 
    now, 
    currentDay, 
    timeInMinutes, 
    convertTimeToMinutes, 
    formatTime,
    getCountdownInfo 
  } = useTime();
  
  const listRef = useRef(null);
  const cardRef = useRef(null);

  const dayOptions = SCHOOL_DAYS.map(day => ({ value: day, label: day }));

  const mergedSchedule = useMemo(() => {
    const bellSchedule = BELL_TIMES[selectedDay];
    if (!bellSchedule) return [];
    
    const dayTimetable = timetableData?.[selectedDay];
    if (!dayTimetable) return bellSchedule;

    return bellSchedule.map(period => {
      const newPeriod = { ...period };
      if (period.name.startsWith('Period ')) {
        const periodNum = period.name.split(' ')[1];
        const classInfo = dayTimetable[periodNum];
        if (classInfo) {
          newPeriod.name = `${classInfo[0]} - ${classInfo[1]}`;
          newPeriod.subject = classInfo[0];
          newPeriod.room = classInfo[1];
        }
      } else if (period.name === 'Roll Call' && dayTimetable['0']) {
        const rollCallInfo = dayTimetable['0'];
        newPeriod.name = `Roll Call - ${rollCallInfo[1]}`;
      }
      return newPeriod;
    });
  }, [selectedDay, timetableData]);

  const countdownInfo = useMemo(() => {
    return getCountdownInfo(currentDay, timetableData);
  }, [currentDay, timetableData, getCountdownInfo, now]);

  const isBreakPeriod = useCallback((name) => {
    return /lunch|recess|break|sport/i.test(name || '');
  }, []);

  const getPeriodStatus = useCallback((period, index) => {
    if (selectedDay !== currentDay) return '';
    
    const periodMinutes = convertTimeToMinutes(period.time);
    const nextPeriodMinutes = index < mergedSchedule.length - 1 
      ? convertTimeToMinutes(mergedSchedule[index + 1].time) 
      : Infinity;
    
    if (timeInMinutes >= periodMinutes && timeInMinutes < nextPeriodMinutes) {
      return 'current';
    }
    
    if (timeInMinutes < periodMinutes) {
      const prevPeriodMinutes = index > 0 
        ? convertTimeToMinutes(mergedSchedule[index - 1].time) 
        : 0;
      if (timeInMinutes >= prevPeriodMinutes) {
        return 'next';
      }
    }
    
    return '';
  }, [selectedDay, currentDay, timeInMinutes, mergedSchedule, convertTimeToMinutes]);

  // GSAP animations
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, []);

  useEffect(() => {
    if (listRef.current) {
      const items = listRef.current.children;
      gsap.fromTo(items,
        { opacity: 0, x: -20 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.3, 
          stagger: 0.03,
          ease: 'power2.out'
        }
      );
    }
  }, [selectedDay]);

  const isEndOfDay = useMemo(() => {
    if (!BELL_TIMES[currentDay]) return true;
    const lastPeriod = BELL_TIMES[currentDay][BELL_TIMES[currentDay].length - 1];
    return timeInMinutes >= convertTimeToMinutes(lastPeriod.time);
  }, [currentDay, timeInMinutes, convertTimeToMinutes]);

  const statusText = useMemo(() => {
    if (selectedDay !== currentDay || isEndOfDay) return 'Upcoming ';
    return '';
  }, [selectedDay, currentDay, isEndOfDay]);

  const getIndicatorPosition = useCallback((period, index) => {
    if (selectedDay !== currentDay) return null;
    const start = convertTimeToMinutes(period.time);
    const end = index < mergedSchedule.length - 1
      ? convertTimeToMinutes(mergedSchedule[index + 1].time)
      : start + 60;
    if (timeInMinutes < start || timeInMinutes >= end) return null;
    const progress = ((timeInMinutes - start) / (end - start)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }, [selectedDay, currentDay, timeInMinutes, mergedSchedule, convertTimeToMinutes]);

  return (
    <Card ref={cardRef} className="schedule-card">
      <div className="schedule-header">
        <h3 className="schedule-title">
          <span className="schedule-title-status">{statusText}</span>
          {selectedDay}
        </h3>
        <div className="schedule-controls">
          <Select 
            options={dayOptions}
            value={selectedDay}
            onChange={(e) => onDayChange(e.target.value)}
          />
          <Button 
            variant="secondary" 
            icon={Settings}
            onClick={onOpenSettings}
            aria-label="Settings"
          />
        </div>
      </div>

      <div className="countdown">
        <span className="countdown-time">{countdownInfo.text}</span>
        {countdownInfo.periodDetails && (
          <span className="countdown-details">
            {countdownInfo.periodDetails.label || (
              <>
                {showSubject && countdownInfo.periodDetails.subject}
                {showSubject && showRoom && ' - '}
                {showRoom && countdownInfo.periodDetails.room}
              </>
            )}
          </span>
        )}
        {!countdownInfo.periodDetails && countdownInfo.nextPeriod && (
          <span className="countdown-details">{countdownInfo.nextPeriod.name}</span>
        )}
      </div>

      <div className="period-list" ref={listRef}>
        {mergedSchedule.map((period, index) => {
          const status = getPeriodStatus(period, index);
          const indicatorPos = getIndicatorPosition(period, index);
          return (
            <div 
              key={`${period.name}-${index}`}
              className={`period-item ${status}`}
            >
              <span className="period-name">{period.name}</span>
              <span className="period-time">{period.time}</span>
              {indicatorPos !== null && (
                <div className="time-indicator dashed" style={{ top: `${indicatorPos}%` }} />
              )}
            </div>
          );
        })}
      </div>

    </Card>
  );
};

export default Schedule;
