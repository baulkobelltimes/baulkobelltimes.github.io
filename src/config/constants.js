// ==============================================
// SCHOOL CONFIGURATION
// ==============================================

export const SCHOOL_NAME = "Baulko";

export const APP_STORAGE_VERSION = "2026-01-26";

export const DEFAULT_QUICK_LINKS = [
  { title: 'Moodle', url: 'http://web1.baulkham-h.schools.nsw.edu.au' },
  { title: 'Sentral', url: 'https://baulkham-h.sentral.com.au' },
  { title: 'Classroom', url: 'https://classroom.google.com' },
  { title: 'Study Music', url: 'https://anycircle11139s.github.io/Music/' },
  { title: 'To-Do List', url: 'https://thetodolist.github.io' }
];

export const BELL_TIMES = {
  Monday: [
    { name: "Roll Call", time: "08:38 AM" },
    { name: "Period 1", time: "08:44 AM" },
    { name: "Period 2", time: "09:23 AM" },
    { name: "Assembly", time: "10:00 AM" },
    { name: "Recess", time: "10:24 AM" },
    { name: "Period 3", time: "10:43 AM" },
    { name: "Period 4", time: "11:20 AM" },
    { name: "Break", time: "11:57 AM" },
    { name: "Period 5", time: "12:02 PM" },
    { name: "Period 6", time: "12:39 PM" },
    { name: "Lunch", time: "01:16 PM" },
    { name: "Period 7", time: "01:52 PM" },
    { name: "Period 8", time: "02:29 PM" },
    { name: "End", time: "03:06 PM" },
  ],
  Tuesday: [
    { name: "Roll Call", time: "08:38 AM" },
    { name: "Period 1", time: "08:44 AM" },
    { name: "Period 2", time: "09:26 AM" },
    { name: "Recess", time: "10:06 AM" },
    { name: "Period 3", time: "10:25 AM" },
    { name: "Period 4", time: "11:05 AM" },
    { name: "Break", time: "11:45 AM" },
    { name: "Period 5", time: "11:50 AM" },
    { name: "Period 6", time: "12:30 PM" },
    { name: "Lunch", time: "01:10 PM" },
    { name: "Period 7", time: "01:46 PM" },
    { name: "Period 8", time: "02:26 PM" },
    { name: "End", time: "03:06 PM" },
  ],
  Wednesday: [
    { name: "Roll Call", time: "08:38 AM" },
    { name: "Period 1", time: "08:44 AM" },
    { name: "Period 2", time: "09:23 AM" },
    { name: "Recess", time: "10:00 AM" },
    { name: "Period 3", time: "10:15 AM" },
    { name: "Period 4", time: "10:52 AM" },
    { name: "Period 5", time: "11:29 AM" },
    { name: "Lunch", time: "12:06 PM" },
    { name: "Sport/Period 6", time: "12:39 PM" },
    { name: "Period 7", time: "01:16 PM" },
    { name: "Period 8", time: "01:53 PM" },
    { name: "End", time: "02:30 PM" },
  ],
  Thursday: [
    { name: "Roll Call", time: "08:38 AM" },
    { name: "Period 1", time: "08:44 AM" },
    { name: "Period 2", time: "09:26 AM" },
    { name: "Recess", time: "10:06 AM" },
    { name: "Period 3", time: "10:25 AM" },
    { name: "Period 4", time: "11:05 AM" },
    { name: "Break", time: "11:45 AM" },
    { name: "Period 5", time: "11:50 AM" },
    { name: "Period 6", time: "12:30 PM" },
    { name: "Lunch", time: "01:10 PM" },
    { name: "Period 7", time: "01:46 PM" },
    { name: "Period 8", time: "02:26 PM" },
    { name: "End", time: "03:06 PM" },
  ],
  Friday: [
    { name: "Roll Call", time: "08:38 AM" },
    { name: "Period 1", time: "08:44 AM" },
    { name: "Period 2", time: "09:26 AM" },
    { name: "Recess", time: "10:05 AM" },
    { name: "Period 3", time: "10:30 AM" },
    { name: "Period 4", time: "11:09 AM" },
    { name: "Break", time: "11:48 AM" },
    { name: "Period 5", time: "11:53 AM" },
    { name: "Period 6", time: "12:32 PM" },
    { name: "Lunch", time: "01:11 PM" },
    { name: "Period 7", time: "01:47 PM" },
    { name: "Period 8", time: "02:27 PM" },
    { name: "End", time: "03:06 PM" },
  ],
};

export const TIME_SETTINGS = {
  MORNING_START: 360,    // 6 AM
  AFTERNOON_START: 720,  // 12 PM
  EVENING_START: 1110,   // 6:30 PM
  NIGHT_START: 1290,     // 9:30 PM
  REFRESH_TIMES: [0, 6],
};

export const TIMER_MODES = {
  pomodoro: 25 * 60,
  break: 5 * 60
};

export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const SCHOOL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
