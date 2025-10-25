// ==============================================
// SCHOOL CONFIGURATION
// ==============================================

// School Name - Used in various places including page title
const SCHOOL_NAME = "Baulko";

// School Links - Default quick links shown in the sidebar
const DEFAULT_QUICK_LINKS = [
    { title: 'Moodle', url: 'http://web1.baulkham-h.schools.nsw.edu.au' },
    { title: 'Sentral', url: 'https://baulkham-h.sentral.com.au' },
    { title: 'Classroom', url: 'https://classroom.google.com' },
    { title: 'Study Music', url: 'https://anycircle11139s.github.io/Music/' },
    { title: 'To-Do List', url: 'https://thetodolist.github.io' }
];

// Bell Times Schedule - Define the daily schedule for each day
const BELL_TIMES = {
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

// Time Settings - Configure time-based features
const TIME_SETTINGS = {
    // Greeting time ranges (in minutes from midnight)
    MORNING_START: 360,    // 6 AM
    AFTERNOON_START: 720,  // 12 PM
    EVENING_START: 1110,   // 6:30 PM
    NIGHT_START: 1290,     // 9:30 PM
    
    // Auto refresh times (hours in 24h format)
    REFRESH_TIMES: [0, 6], // Refresh at 12 AM and 6 AM
};

// Study Timer Settings
const TIMER_MODES = {
    pomodoro: 25 * 60, // 25 minutes in seconds
    break: 5 * 60      // 5 minutes in seconds
};



// ==============================================
// APPLICATION CODE BELOW
// ==============================================

let userTimetable = localStorage.getItem('userTimetable');

// Use BELL_TIMES for all bell times references
const bellTimes = BELL_TIMES;

const daySelector = document.getElementById("day-selector");
const scheduleList = document.getElementById("schedule-list");
const countdown = document.getElementById("countdown");
const selectedDayDisplay = document.getElementById("selected-day");

let timer = null;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isTimerRunning = false;
let timerAudioInterval = null;

function mergeTimetableData(day) {
    const bellSchedule = bellTimes[day];
    const dayTimetable = userTimetable ? JSON.parse(userTimetable)[day] : null;

    if (!dayTimetable) return bellSchedule;

    return bellSchedule.map(period => {
        const newPeriod = { ...period };
        if (period.name.startsWith('Period ')) {
            const periodNum = period.name.split(' ')[1];
            const classInfo = dayTimetable[periodNum];
            if (classInfo) {
                newPeriod.name = `${classInfo[0]} - ${classInfo[1]}`;
            }
        } else if (period.name === 'Roll Call' && dayTimetable['0']) {
            const rollCallInfo = dayTimetable['0'];
            newPeriod.name = `Roll Call - ${rollCallInfo[1]}`;
        }
        return newPeriod;
    });
}

function updateSchedule() {
    const selectedDay = daySelector.value;
    const now = new Date();
    const currentDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
    const isEndOfDay = !getNextPeriod(currentDay);
    
    const statusText = (isEndOfDay && selectedDay !== currentDay) ? "Upcoming " : "";
    document.getElementById('schedule-status').textContent = statusText;
    document.getElementById('selected-day').textContent = selectedDay;
    
    scheduleList.innerHTML = "";

    const mergedSchedule = mergeTimetableData(selectedDay);
    
    // Calculate current time in minutes for comparison
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

    // Get school start and end times for the selected day
    const schoolDay = bellTimes[selectedDay];
    const schoolStartTime = convertTimeToMinutes(schoolDay[0].time); // First period
    const schoolEndTime = convertTimeToMinutes(schoolDay[schoolDay.length - 1].time); // Last period

    // Check if current time is within school hours
    const isSchoolHours = currentTimeMinutes >= schoolStartTime && currentTimeMinutes <= schoolEndTime;
    
    // Only show current/next period indicators if viewing the current day
    const showPeriodIndicators = selectedDay === currentDay;

    mergedSchedule.forEach((period, index) => {
        const periodElement = document.createElement("div");
        periodElement.classList.add("period");
        
        // Only add current/next period indicators if we're viewing today's schedule
        if (showPeriodIndicators) {
            const periodMinutes = convertTimeToMinutes(period.time);
            const isCurrentPeriod = currentTimeMinutes >= periodMinutes && 
                (index === mergedSchedule.length - 1 || 
                 currentTimeMinutes < convertTimeToMinutes(mergedSchedule[index + 1].time));
            
            const isNextPeriod = !isCurrentPeriod && 
                periodMinutes > currentTimeMinutes && 
                (index === 0 || currentTimeMinutes >= convertTimeToMinutes(mergedSchedule[index - 1].time));
            
            // Add classes for styling
            if (isCurrentPeriod) periodElement.classList.add("current-period");
            if (isNextPeriod) periodElement.classList.add("next-period");
        }
        
        const nameSpan = document.createElement("span");
        nameSpan.textContent = period.name;
        
        const timeSpan = document.createElement("span");
        timeSpan.textContent = period.time;
        
        periodElement.appendChild(nameSpan);
        periodElement.appendChild(timeSpan);
        scheduleList.appendChild(periodElement);

        // Only show time indicator if it's school hours and the current day
        if (isSchoolHours && selectedDay === currentDay) {
            const periodMinutes = convertTimeToMinutes(period.time);
            let nextPeriodMinutes;
            
            if (index < mergedSchedule.length - 1) {
                nextPeriodMinutes = convertTimeToMinutes(mergedSchedule[index + 1].time);
            }

            if (currentTimeMinutes >= periodMinutes && 
                (!nextPeriodMinutes || currentTimeMinutes < nextPeriodMinutes)) {
                
                const indicator = document.createElement("div");
                indicator.className = "current-time-indicator";
                
                const periodDuration = nextPeriodMinutes ? (nextPeriodMinutes - periodMinutes) : 60;
                const timeElapsed = currentTimeMinutes - periodMinutes;
                const position = (timeElapsed / periodDuration) * 100;
                indicator.style.top = `${position}%`;
                
                const timeLabel = document.createElement("span");
                timeLabel.className = "current-time-label";
                timeLabel.textContent = now.toLocaleTimeString('en-US', { 
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                indicator.appendChild(timeLabel);
                
                periodElement.appendChild(indicator);
            }
        }
    });

    updateCountdown();
}

// Helper function to convert time string to minutes
function convertTimeToMinutes(timeStr) {
    const [time, meridian] = timeStr.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    
    if (meridian === "PM" && hours !== 12) {
        return (hours + 12) * 60 + minutes;
    } else if (meridian === "AM" && hours === 12) {
        return minutes;
    } else {
        return hours * 60 + minutes;
    }
}

// Helper function to format current time
function formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
}

// Helper function to get next period
function getNextPeriod(day) {
    if (!bellTimes[day]) return null;
    
    const now = new Date();
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

    for (const period of bellTimes[day]) {
        const [time, meridian] = period.time.split(" ");
        const [hours, minutes] = time.split(":").map(Number);
        let periodMinutes;
        
        if (meridian === "PM" && hours !== 12) {
            periodMinutes = (hours + 12) * 60 + minutes;
        } else if (meridian === "AM" && hours === 12) {
            periodMinutes = minutes;
        } else {
            periodMinutes = hours * 60 + minutes;
        }

        if (periodMinutes > currentTimeMinutes) {
            return period;
        }
    }
    return null;
}

function getCountdownPreferences() {
    const showRoom = localStorage.getItem('showRoom') !== 'false';
    const showSubject = localStorage.getItem('showSubject') !== 'false';
    return { showRoom, showSubject };
}

function updateCountdownPreferences() {
    const showRoom = document.getElementById('show-room').checked;
    const showSubject = document.getElementById('show-subject').checked;
    localStorage.setItem('showRoom', showRoom);
    localStorage.setItem('showSubject', showSubject);
    updateCountdown(); // Refresh the countdown display
}

function updateCountdown() {
    const now = new Date();
    const currentDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
    
    // Only show countdown if it's a school day
    if (!bellTimes[currentDay]) {
        countdown.textContent = "No school today.";
        document.title = "Baulko Bell Times";
        return;
    }

    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
    const currentSeconds = now.getSeconds();

    let nextPeriod = null;
    let timeUntilNextMinutes = Infinity;

    // Always use currentDay for countdown instead of selected day
    for (const period of bellTimes[currentDay]) {
        const [time, meridian] = period.time.split(" ");
        const [hours, minutes] = time.split(":").map(Number);
        let periodMinutes;
        
        if (meridian === "PM" && hours !== 12) {
            periodMinutes = (hours + 12) * 60 + minutes;
        } else if (meridian === "AM" && hours === 12) {
            periodMinutes = minutes;
        } else {
            periodMinutes = hours * 60 + minutes;
        }

        const diffMinutes = periodMinutes - currentTimeMinutes - 1;

        if (diffMinutes >= 0 && diffMinutes < timeUntilNextMinutes) {
            nextPeriod = period;
            timeUntilNextMinutes = diffMinutes;
        }
    }

    if (nextPeriod) {
        const hours = Math.floor(timeUntilNextMinutes / 60);
        const minutes = timeUntilNextMinutes % 60;
        const seconds = 60 - currentSeconds;
        
        let countdownText = '';
        if (hours > 0) {
            countdownText += `${hours}h ${minutes}m`;
        } else {
            countdownText += `${minutes}m ${seconds}s`;
        }

        // Get the next period's details from timetable if available
        let periodDetails = '';
        const { showRoom, showSubject } = getCountdownPreferences();
        
        if (userTimetable) {
            const timetableData = JSON.parse(userTimetable)[currentDay];
            if (timetableData) {
                let periodNum = nextPeriod.name.split(' ')[1];
                if (periodNum && timetableData[periodNum]) {
                    const [subject, room] = timetableData[periodNum];
                    const details = [];
                    
                    if (showSubject && subject) details.push(subject);
                    if (showRoom && room) details.push(room);
                    
                    if (details.length > 0) {
                        periodDetails = `\n${details.join(' - ')}`;
                    }
                }
            }
        }
        
        const displayText = `Next period in: ${countdownText}${periodDetails}`;
        countdown.innerHTML = displayText.replace('\n', '<br><span class="period-details">');
        if (periodDetails) countdown.innerHTML += '</span>';
        document.title = `${countdownText} - Baulko Bell Times`;
    } else {
        countdown.textContent = "No more periods today.";
        document.title = "Baulko Bell Times";
    }
}

function getGreeting() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeInMinutes = hours * 60 + minutes;
    const userName = localStorage.getItem('userName');
    const greeting = timeInMinutes >= TIME_SETTINGS.MORNING_START && timeInMinutes < TIME_SETTINGS.AFTERNOON_START ? "Good morning" : 
                    timeInMinutes >= TIME_SETTINGS.AFTERNOON_START && timeInMinutes < TIME_SETTINGS.EVENING_START ? "Good afternoon" :
                    timeInMinutes >= TIME_SETTINGS.EVENING_START && timeInMinutes < TIME_SETTINGS.NIGHT_START ? "Good evening" :
                    "Good night";
    
    return userName ? `${greeting}, ${userName}` : greeting;
}

function updateGreeting() {
    const greetingTextElement = document.getElementById('greeting-text');
    const userNameElement = document.getElementById('user-name');
    const userName = localStorage.getItem('userName');
    const baseGreeting = getBaseGreeting();
    
    greetingTextElement.textContent = baseGreeting;
    userNameElement.textContent = userName ? `, ${userName}` : '';
}

function getBaseGreeting() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeInMinutes = hours * 60 + minutes;
    
    return timeInMinutes >= TIME_SETTINGS.MORNING_START && timeInMinutes < TIME_SETTINGS.AFTERNOON_START ? "Good morning" : 
           timeInMinutes >= TIME_SETTINGS.AFTERNOON_START && timeInMinutes < TIME_SETTINGS.EVENING_START ? "Good afternoon" :
           timeInMinutes >= TIME_SETTINGS.EVENING_START && timeInMinutes < TIME_SETTINGS.NIGHT_START ? "Good evening" :
           "Good night";
}

function changeName() {
    const newName = prompt("Enter your new name:");
    if (newName) {
        localStorage.setItem('userName', newName.trim());
        updateGreeting();
    }
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const today = days[new Date().getDay()];

// Only set to today if it's a school day
if (bellTimes[today]) {
    daySelector.value = today;
} else {
    daySelector.value = "Monday"; // Default to Monday if weekend
}

daySelector.addEventListener("change", () => {
    updateSchedule();
    localStorage.setItem('selectedDay', daySelector.value);
});

setInterval(() => {
    updateCountdown();
    updateGreeting();
    updateSchedule();
}, 1000);

updateGreeting(); // Initial call
updateSchedule(); // Initial call


function initializeUser() {
    // Onboarding disabled: do not show welcome modal
    // Just prefill name input if it exists
    const userName = localStorage.getItem('userName');
    const nameInput = document.getElementById('name-input');
    if (nameInput && userName) {
        nameInput.value = userName;
    }
}

function showWelcomeModal() {
    const modal = document.getElementById('welcome-modal');
    const nameInput = document.getElementById('welcome-name-input');
    modal.style.display = 'block';
    
    // Focus the input field
    nameInput.focus();
    
    // Handle enter key
    nameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            setInitialName();
        }
    });
}

function setInitialName() {
    const nameInput = document.getElementById('welcome-name-input');
    const name = nameInput.value.trim();
    
    if (name) {
        localStorage.setItem('userName', name);
        updateGreeting();
    }
    
    document.getElementById('welcome-modal').style.display = 'none';
    // Set onboarding complete flag
    localStorage.setItem('onboardingComplete', 'true');
}

function updateName() {
    const nameInput = document.getElementById('name-input');
    const name = nameInput.value.trim();
    
    if (name) {
        localStorage.setItem('userName', name);
        updateGreeting();
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'name-update-success';
        successMsg.textContent = 'Name updated successfully!';
        nameInput.parentNode.appendChild(successMsg);
        
        // Remove success message after 2 seconds
        setTimeout(() => {
            successMsg.remove();
        }, 2000);
    }
}

// Update the updateGreeting function to handle no name case more gracefully
function updateGreeting() {
    const greetingTextElement = document.getElementById('greeting-text');
    const userNameElement = document.getElementById('user-name');
    const userName = localStorage.getItem('userName');
    const baseGreeting = getBaseGreeting();
    
    greetingTextElement.textContent = baseGreeting;
    userNameElement.textContent = userName ? `, ${userName}` : '';
}

// Add this with other initialization code
document.getElementById('user-name').addEventListener('click', changeName);

// Add the timetable handling functions
const timetableUpload = document.getElementById("timetableupload");

// Add these functions for modal handling
function toggleSettingsModal() {
    const modal = document.getElementById('settings-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('settings-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Update the timetable handlers to close modal after action
function clearTimetableStorage() {
    try {
        localStorage.removeItem('userTimetable');
        userTimetable = null;
        updateSchedule();
        toggleSettingsModal();
    } catch(error) {
        console.error(error);
    }
}

timetableUpload.addEventListener('change', function() {
    const fileReader = new FileReader();
    fileReader.onload = function() {
        try {
            const jcaldata = ICAL.parse(fileReader.result)[2];
            const timetableData = parseTimetable(jcaldata);
            localStorage.setItem('userTimetable', JSON.stringify(timetableData));
            userTimetable = localStorage.getItem('userTimetable');
            updateSchedule();
            toggleSettingsModal();
        } catch (error) {
            console.error(error);
        }
    };
    fileReader.readAsText(this.files[0]);
});

// Add these functions to handle ICS parsing
function parseTimetable(jcaldata) {
    const classarray = [];
    const datearray = [];

    // Find first and last dates of a full school week
    const firstmondayvevent = findFirstMonday(jcaldata);
    const firsteventdate = new Date(firstmondayvevent.toDateString());
    const lasteventdate = new Date(firstmondayvevent.addDays(4).toDateString());

    // Loop through all vevents within date range
    let veventparseloop = 1;
    while (veventparseloop < jcaldata.length) {
        // Iterate over vevents
        const currentvevent = jcaldata[veventparseloop][1];
        const currentveventdate = new Date(new Date(currentvevent[0][3]).toDateString());
        
        // Check if vevent is within date range
        if ((currentveventdate <= lasteventdate) && (currentveventdate >= firsteventdate)) {
            // Get class details from vevent
            const currentveventperiod = currentvevent[4][3].split("\n")[1].replace("Period: ", "");
            const currentveventname = currentvevent[5][3];
            const currentveventlocation = currentvevent[6][3].replace("Room: ", "");
            const currentveventteacher = capitalizeWords(currentvevent[4][3].split("\n")[0].replace("Teacher:  ", ""));
            
            // Check if class is before/after school
            if (currentveventperiod.length <= 8) {
                // Check if class is between period 1 and 8
                if ((parseInt(currentveventperiod.slice(-1)) >= 1) && (parseInt(currentveventperiod.slice(-1)) <= 8)) {
                    // Set period to only the integer
                    const periodNum = currentveventperiod.slice(-1);
                    // Add class details to array
                    const tempclassdetails = [currentveventdate, periodNum, currentveventname, currentveventlocation, currentveventteacher];
                    classarray.push(tempclassdetails);
                    // Add date to datearray if not already present
                    if (!isInArray(datearray, currentveventdate)) {
                        datearray.push(currentveventdate);
                    }
                }
            } else if (currentveventperiod === 'Roll Call') {
                const tempclassdetails = [currentveventdate, '0', currentveventname, currentveventlocation, currentveventteacher];
                classarray.push(tempclassdetails);
                if (!isInArray(datearray, currentveventdate)) {
                    datearray.push(currentveventdate);
                }
            }
        }
        veventparseloop++;
    }
    return createTimetableJson(classarray, datearray);
}

// Helper functions for parseTimetable
Date.prototype.addDays = function(days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function isInArray(array, value) {
    return array.some(item => item.getTime() === value.getTime());
}

function capitalizeWords(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function findFirstMonday(jcaldata) {
    for (let i = 0; i < jcaldata.length; i++) {
        if (jcaldata[i][1] && jcaldata[i][1][0]) {
            const date = new Date(jcaldata[i][1][0][3]);
            if (date.getDay() === 1) {
                return date;
            }
        }
    }
    return new Date(); // fallback to current date
}

function createTimetableJson(classarray, datearray) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timetabledict = {};
    let x = 0;

    for (let i = 0; i < datearray.length; i++) {
        const tempdaydict = {};
        let daycompleted = false;

        while (!daycompleted) {
            const classlistitemtemp = classarray[x];
            if (classlistitemtemp[0].getTime() === datearray[i].getTime()) {
                const periodKey = classlistitemtemp[1];
                tempdaydict[periodKey] = [
                    classlistitemtemp[2], // name
                    classlistitemtemp[3], // location
                    classlistitemtemp[4]  // teacher
                ];
                
                if (classarray[x + 1] !== undefined) {
                    x++;
                } else {
                    timetabledict[days[datearray[i].getDay()]] = tempdaydict;
                    daycompleted = true;
                }
            } else {
                timetabledict[days[datearray[i].getDay()]] = tempdaydict;
                daycompleted = true;
            }
        }
    }
    return timetabledict;
}

// Update themes object with more options
const themes = {
    default: {
        '--primary-color': '#6200ea',
        '--background-color': '#f9f9f9',
        '--card-background': '#fff',
        '--text-color': '#333',
        '--border-color': '#ddd'
    },
    dark: {
        '--primary-color': '#bb86fc',
        '--background-color': '#121212',
        '--card-background': '#1e1e1e',
        '--text-color': '#ffffff',
        '--border-color': '#333'
    },
    light: {
        '--primary-color': '#1976d2',
        '--background-color': '#ffffff',
        '--card-background': '#f5f5f5',
        '--text-color': '#212121',
        '--border-color': '#e0e0e0'
    },
    purple: {
        '--primary-color': '#9c27b0',
        '--background-color': '#f3e5f5',
        '--card-background': '#fff',
        '--text-color': '#4a148c',
        '--border-color': '#e1bee7'
    },
    green: {
        '--primary-color': '#2e7d32',
        '--background-color': '#f1f8e9',
        '--card-background': '#fff',
        '--text-color': '#1b5e20',
        '--border-color': '#c8e6c9'
    },
    ocean: {
        '--primary-color': '#0277bd',
        '--background-color': '#e1f5fe',
        '--card-background': '#fff',
        '--text-color': '#01579b',
        '--border-color': '#b3e5fc'
    },
    sunset: {
        '--primary-color': '#f57c00',
        '--background-color': '#fff3e0',
        '--card-background': '#fff',
        '--text-color': '#e65100',
        '--border-color': '#ffe0b2'
    },
    minimal: {
        '--primary-color': '#424242',
        '--background-color': '#fafafa',
        '--card-background': '#fff',
        '--text-color': '#212121',
        '--border-color': '#eeeeee'
    },
    retro: {
        '--primary-color': '#d32f2f',
        '--background-color': '#ffebee',
        '--card-background': '#fff',
        '--text-color': '#b71c1c',
        '--border-color': '#ffcdd2'
    },
    forest: {
        '--primary-color': '#004d40',
        '--background-color': '#e0f2f1',
        '--card-background': '#fff',
        '--text-color': '#00695c',
        '--border-color': '#b2dfdb'
    },
    candy: {
        '--primary-color': '#ec407a',
        '--background-color': '#fce4ec',
        '--card-background': '#fff',
        '--text-color': '#c2185b',
        '--border-color': '#f8bbd0'
    },
    coffee: {
        '--primary-color': '#795548',
        '--background-color': '#efebe9',
        '--card-background': '#fff',
        '--text-color': '#4e342e',
        '--border-color': '#d7ccc8'
    },
    mint: {
        '--primary-color': '#00bfa5',
        '--background-color': '#e0f2f1',
        '--card-background': '#fff',
        '--text-color': '#00897b',
        '--border-color': '#b2dfdb'
    },
    coral: {
        '--primary-color': '#ff7043',
        '--background-color': '#fbe9e7',
        '--card-background': '#fff',
        '--text-color': '#e64a19',
        '--border-color': '#ffccbc'
    },
    lavender: {
        '--primary-color': '#7e57c2',
        '--background-color': '#ede7f6',
        '--card-background': '#fff',
        '--text-color': '#512da8',
        '--border-color': '#d1c4e9'
    }
};

// Add study focus dynamic theme
function updateStudyFocusTheme() {
    const hour = new Date().getHours();
    let theme;
    
    if (hour >= 5 && hour < 12) { // Morning study
        theme = {
            '--primary-color': '#00acc1',
            '--background-color': '#e0f7fa',
            '--card-background': '#fff',
            '--text-color': '#006064',
            '--border-color': '#b2ebf2'
        };
    } else if (hour >= 12 && hour < 17) { // Afternoon focus
        theme = {
            '--primary-color': '#43a047',
            '--background-color': '#f1f8e9',
            '--card-background': '#fff',
            '--text-color': '#2e7d32',
            '--border-color': '#dcedc8'
        };
    } else { // Evening wind down
        theme = {
            '--primary-color': '#7986cb',
            '--background-color': '#e8eaf6',
            '--card-background': '#fff',
            '--text-color': '#3949ab',
            '--border-color': '#c5cae9'
        };
    }
    return theme;
}

// Add energy level theme
function updateEnergyTheme() {
    const hour = new Date().getHours();
    let theme;
    
    if (hour >= 5 && hour < 10) { // Morning energy boost
        theme = {
            '--primary-color': '#ffd600',
            '--background-color': '#fffde7',
            '--card-background': '#fff',
            '--text-color': '#f57f17',
            '--border-color': '#fff9c4'
        };
    } else if (hour >= 10 && hour < 15) { // Peak performance
        theme = {
            '--primary-color': '#f4511e',
            '--background-color': '#fbe9e7',
            '--card-background': '#fff',
            '--text-color': '#d84315',
            '--border-color': '#ffccbc'
        };
    } else if (hour >= 15 && hour < 20) { // Afternoon sustain
        theme = {
            '--primary-color': '#00897b',
            '--background-color': '#e0f2f1',
            '--card-background': '#fff',
            '--text-color': '#00695c',
            '--border-color': '#b2dfdb'
        };
    } else { // Evening calm
        theme = {
            '--primary-color': '#5e35b1',
            '--background-color': '#ede7f6',
            '--card-background': '#fff',
            '--text-color': '#4527a0',
            '--border-color': '#d1c4e9'
        };
    }
    return theme;
}

// Update hemisphere detection to use IP geolocation
function detectHemisphere() {
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            const isNorthernHemisphere = data.latitude > 0;
            localStorage.setItem('hemisphere', isNorthernHemisphere ? 'north' : 'south');
        })
        .catch(() => {
            // If IP geolocation fails, default to northern hemisphere
            localStorage.setItem('hemisphere', 'north');
        });
}

// Update the seasonal theme function
function getSeasonTheme() {
    const date = new Date();
    const month = date.getMonth();
    const isNorthernHemisphere = localStorage.getItem('hemisphere') === 'north';
    
    // Adjust season based on hemisphere
    let season;
    if (isNorthernHemisphere) {
        if (month >= 2 && month <= 4) season = 'spring';
        else if (month >= 5 && month <= 7) season = 'summer';
        else if (month >= 8 && month <= 10) season = 'autumn';
        else season = 'winter';
    } else {
        if (month >= 2 && month <= 4) season = 'autumn';
        else if (month >= 5 && month <= 7) season = 'winter';
        else if (month >= 8 && month <= 10) season = 'spring';
        else season = 'summer';
    }
    
    // Return theme based on season
    switch(season) {
        case 'spring':
            return {
                '--primary-color': '#66bb6a',
                '--background-color': '#f1f8e9',
                '--card-background': '#fff',
                '--text-color': '#2e7d32',
                '--border-color': '#dcedc8'
            };
        case 'summer':
            return {
                '--primary-color': '#ffd54f',
                '--background-color': '#fffde7',
                '--card-background': '#fff',
                '--text-color': '#f9a825',
                '--border-color': '#fff9c4'
            };
        case 'autumn':
            return {
                '--primary-color': '#ff7043',
                '--background-color': '#fbe9e7',
                '--card-background': '#fff',
                '--text-color': '#d84315',
                '--border-color': '#ffccbc'
            };
        case 'winter':
            return {
                '--primary-color': '#4fc3f7',
                '--background-color': '#e1f5fe',
                '--card-background': '#fff',
                '--text-color': '#0288d1',
                '--border-color': '#b3e5fc'
            };
    }
}

// Update the dynamic theme function
function updateDynamicTheme(type) {
    let theme;
    const hour = new Date().getHours();
    
    switch(type) {
        case 'study':
            theme = updateStudyFocusTheme();
            break;
        case 'energy':
            theme = updateEnergyTheme();
            break;
        case 'time':
            if (hour >= 5 && hour < 8) { // Dawn
                theme = {
                    '--primary-color': '#ff7043',
                    '--background-color': '#fbe9e7',
                    '--card-background': '#fff',
                    '--text-color': '#d84315',
                    '--border-color': '#ffccbc'
                };
            } else if (hour >= 8 && hour < 17) { // Day
                theme = {
                    '--primary-color': '#039be5',
                    '--background-color': '#e1f5fe',
                    '--card-background': '#fff',
                    '--text-color': '#01579b',
                    '--border-color': '#b3e5fc'
                };
            } else if (hour >= 17 && hour < 20) { // Sunset
                theme = {
                    '--primary-color': '#fb8c00',
                    '--background-color': '#fff3e0',
                    '--card-background': '#fff',
                    '--text-color': '#ef6c00',
                    '--border-color': '#ffe0b2'
                };
            } else { // Night
                theme = {
                    '--primary-color': '#5c6bc0',
                    '--background-color': '#e8eaf6',
                    '--card-background': '#fff',
                    '--text-color': '#283593',
                    '--border-color': '#c5cae9'
                };
            }
            break;
        case 'season':
            theme = getSeasonTheme();
            break;
    }
    
    Object.entries(theme).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
        // Update RGB values when primary color changes
        if (property === '--primary-color') {
            const rgb = hexToRgb(value);
            if (rgb) {
                document.documentElement.style.setProperty('--primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
            }
        }
    });
}

// Update the initialization to handle async hemisphere detection
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        if (savedTheme.startsWith('dynamic-')) {
            const type = savedTheme.split('-')[1];
            if (type === 'season') {
                // Wait for hemisphere detection before applying seasonal theme
                const hemisphereCheck = setInterval(() => {
                    if (localStorage.getItem('hemisphere')) {
                        clearInterval(hemisphereCheck);
                        updateDynamicTheme(type);
                        if (!window.dynamicThemeInterval) {
                            window.dynamicThemeInterval = setInterval(() => updateDynamicTheme(type), 60000);
                        }
                    }
                }, 100);
            } else {
                updateDynamicTheme(type);
                if (!window.dynamicThemeInterval) {
                    window.dynamicThemeInterval = setInterval(() => updateDynamicTheme(type), 60000);
                }
            }
        } else {
            const theme = themes[savedTheme];
            Object.entries(theme).forEach(([property, value]) => {
                document.documentElement.style.setProperty(property, value);
            });
        }
    } else {
        setTheme('default');
    }
}

// Call detectHemisphere when the page loads
document.addEventListener('DOMContentLoaded', () => {
    detectHemisphere();
    initializeTheme();
    loadNotes();
    loadQuickLinks();
    initializeGames();
    
    // Set initial state for pomodoro toggle
    const pomodoroToggle = document.getElementById('pomodoro-toggle');
    if (pomodoroToggle) {
        pomodoroToggle.checked = localStorage.getItem('pomodoroEnabled') === 'true';
    }
    
    // Add smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Set initial countdown preference states
    const { showRoom, showSubject } = getCountdownPreferences();
    if (document.getElementById('show-room')) {
        document.getElementById('show-room').checked = showRoom;
    }
    if (document.getElementById('show-subject')) {
        document.getElementById('show-subject').checked = showSubject;
    }
});

// Update setTheme function to handle async hemisphere detection
function setTheme(themeName) {
    if (window.dynamicThemeInterval) {
        clearInterval(window.dynamicThemeInterval);
        window.dynamicThemeInterval = null;
    }

    if (themeName.startsWith('dynamic-')) {
        const type = themeName.split('-')[1];
        if (type === 'season' && !localStorage.getItem('hemisphere')) {
            // If setting seasonal theme and hemisphere not yet detected, wait for it
            const hemisphereCheck = setInterval(() => {
                if (localStorage.getItem('hemisphere')) {
                    clearInterval(hemisphereCheck);
                    updateDynamicTheme(type);
                    window.dynamicThemeInterval = setInterval(() => updateDynamicTheme(type), 60000);
                }
            }, 100);
        } else {
            updateDynamicTheme(type);
            window.dynamicThemeInterval = setInterval(() => updateDynamicTheme(type), 60000);
        }
    } else {
        const theme = themes[themeName];
        Object.entries(theme).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
            // Update RGB values when primary color changes
            if (property === '--primary-color') {
                const rgb = hexToRgb(value);
                if (rgb) {
                    document.documentElement.style.setProperty('--primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
                }
            }
        });
    }
    localStorage.setItem('theme', themeName);
}

// Add helper function to convert hex to RGB
function hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Handle both short and long hex formats
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }
    
    const bigint = parseInt(hex, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`${tabName}-tab`).classList.add('active');
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
}

function updateCustomTheme() {
    const primaryColor = document.getElementById('primary-color').value;
    const bgColor = document.getElementById('bg-color').value;
    const textColor = document.getElementById('text-color').value;
    
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--background-color', bgColor);
    document.documentElement.style.setProperty('--text-color', textColor);
    
    localStorage.setItem('customTheme', JSON.stringify({
        '--primary-color': primaryColor,
        '--background-color': bgColor,
        '--text-color': textColor
    }));
}

function resetTheme() {
    setTheme('default');
    localStorage.removeItem('customTheme');
}

// Replace the existing notepad functions with these
function toggleNotepad() {
    const notepadToggle = document.getElementById('notepad-toggle');
    const notepad = document.getElementById('notepad');
    
    localStorage.setItem('notepadEnabled', notepadToggle.checked);
    notepad.style.display = notepadToggle.checked ? 'block' : 'none';
}

function formatText(command, value = null) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    if (command === 'size') {
        const range = selection.getRangeAt(0);
        if (range.collapsed) return;

        const content = range.extractContents();
        const span = document.createElement('span');
        
        // Remove any existing font-size styles from child elements
        const existingSizeSpans = content.querySelectorAll('span[style*="font-size"]');
        existingSizeSpans.forEach(span => {
            const parent = span.parentNode;
            while (span.firstChild) {
                parent.insertBefore(span.firstChild, span);
            }
            parent.removeChild(span);
        });
        
        switch(value) {
            case 'small':
                span.style.fontSize = '0.875rem';
                break;
            case 'medium':
                span.style.fontSize = '1rem';
                break;
            case 'large':
                span.style.fontSize = '1.25rem';
                break;
        }
        
        span.appendChild(content);
        range.insertNode(span);
        selection.removeAllRanges();
    } else {
        document.execCommand(command, false, null);
    }
    document.getElementById('notes-content').focus();
}

function saveNotes() {
    const notesContent = document.getElementById('notes-content').innerHTML;
    localStorage.setItem('notes', notesContent);
}

function loadNotes() {
    const notesContent = localStorage.getItem('notes') || '';
    document.getElementById('notes-content').innerHTML = notesContent;
    
    const notepadEnabled = localStorage.getItem('notepadEnabled') === 'true';
    const notepadToggle = document.getElementById('notepad-toggle');
    const notepad = document.getElementById('notepad');
    
    notepadToggle.checked = notepadEnabled;
    notepad.style.display = notepadEnabled ? 'block' : 'none';
}

function clearNotes() {
    if (confirm('Are you sure you want to clear all notes?')) {
        document.getElementById('notes-content').innerHTML = '';
        localStorage.setItem('notes', '');
    }
}

// Add event listener for notes autosave
document.getElementById('notes-content').addEventListener('input', saveNotes);

// Default quick links
const defaultQuickLinks = [
    { title: 'Moodle', url: 'http://web1.baulkham-h.schools.nsw.edu.au' },
    { title: 'Sentral', url: 'https://baulkham-h.sentral.com.au' },
    { title: 'Classroom', url: 'https://classroom.google.com' },
    { title: 'Study Music', url: 'https://anycircle11139s.github.io/Music/' },
    { title: 'To-do List', url: 'https://thetodolist.github.io' }
];

function toggleQuickLinks() {
    const quickLinksToggle = document.getElementById('quick-links-toggle');
    const quickLinks = document.getElementById('quick-links');
    const schedule = document.querySelector('.schedule');
    
    localStorage.setItem('quickLinksEnabled', quickLinksToggle.checked);
    quickLinks.style.display = quickLinksToggle.checked ? 'block' : 'none';
    
    // Update the sidebar visibility based on any enabled feature
    const pomodoroEnabled = localStorage.getItem('pomodoroEnabled') === 'true';
    const quoteEnabled = localStorage.getItem('quoteEnabled') === 'true';
    
    if (quickLinksToggle.checked || pomodoroEnabled || quoteEnabled) {
        schedule.classList.add('with-quick-links');
    } else {
        schedule.classList.remove('with-quick-links');
    }
}

function loadQuickLinks() {
    const quickLinksEnabled = localStorage.getItem('quickLinksEnabled') === 'true';
    const pomodoroEnabled = localStorage.getItem('pomodoroEnabled') === 'true';
    const quoteEnabled = localStorage.getItem('quoteEnabled') === 'true';
    const quickLinksToggle = document.getElementById('quick-links-toggle');
    const pomodoroToggle = document.getElementById('pomodoro-toggle');
    const quoteToggle = document.getElementById('quote-toggle');
    const quickLinks = document.getElementById('quick-links');
    const pomodoro = document.getElementById('pomodoro');
    const quote = document.getElementById('quote-of-day');
    const quickLinksList = document.querySelector('.quick-links-list');
    
    // Set the toggle states
    quickLinksToggle.checked = quickLinksEnabled;
    pomodoroToggle.checked = pomodoroEnabled;
    quoteToggle.checked = quoteEnabled;
    
    // Update displays
    quickLinks.style.display = quickLinksEnabled ? 'block' : 'none';
    pomodoro.style.display = pomodoroEnabled ? 'block' : 'none';
    quote.style.display = quoteEnabled ? 'block' : 'none';
    
    // Update sidebar visibility
    updateSidebarVisibility();
    
    // Load saved links or use defaults
    const savedLinks = JSON.parse(localStorage.getItem('quickLinks')) || defaultQuickLinks;
    quickLinksList.innerHTML = savedLinks.map((link) => `
        <a href="${ensureHttps(link.url)}" class="quick-link" target="_blank">
            ${link.title}
        </a>
    `).join('');
}

// Function to ensure URLs have https://
function ensureHttps(url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'https://' + url;
    }
    return url;
}

// Update editQuickLinks function to handle https and maintain order
function editQuickLinks() {
    const savedLinks = JSON.parse(localStorage.getItem('quickLinks')) || DEFAULT_QUICK_LINKS;
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content settings-modal">
            <h3>Edit Quick Links</h3>
            <p class="settings-description">Drag and drop to reorder your quick links, or add new ones below.</p>
            <div class="quick-links-editor">
                ${savedLinks.map((link, index) => `
                    <div class="link-edit" data-index="${index}">
                        <div class="drag-handle">⋮⋮</div>
                        <div class="link-inputs">
                            <input type="text" placeholder="Title" value="${link.title}" class="link-title">
                            <input type="text" placeholder="URL" value="${link.url}" class="link-url">
                        </div>
                        <button onclick="deleteQuickLink(${index})" class="clear-btn" title="Delete link">×</button>
                    </div>
                `).join('')}
            </div>
            <div class="modal-buttons">
                <button onclick="addQuickLink()" class="settings-btn">Add Link</button>
                <button onclick="saveQuickLinks()" class="upload-btn">Save Changes</button>
            </div>
            <button class="close-btn" onclick="closeQuickLinksEditor()">×</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Setup drag and drop for editor
    setupEditorDragAndDrop(modal.querySelector('.quick-links-editor'));
}

function setupEditorDragAndDrop(container) {
    const items = container.getElementsByClassName('link-edit');
    
    Array.from(items).forEach(item => {
        const dragHandle = item.querySelector('.drag-handle');
        
        dragHandle.addEventListener('mousedown', () => {
            item.draggable = true;
        });
        
        dragHandle.addEventListener('mouseup', () => {
            item.draggable = false;
        });
        
        item.addEventListener('dragstart', handleEditorDragStart);
        item.addEventListener('dragend', handleEditorDragEnd);
        item.addEventListener('dragover', handleEditorDragOver);
        item.addEventListener('drop', handleEditorDrop);
    });
}

function handleEditorDragStart(e) {
    this.classList.add('dragging');
    e.dataTransfer.setData('text/plain', this.dataset.index);
}

function handleEditorDragEnd(e) {
    this.classList.remove('dragging');
    this.draggable = false;
}

function handleEditorDragOver(e) {
    e.preventDefault();
    const draggingItem = document.querySelector('.link-edit.dragging');
    if (draggingItem === this) return;
    
    const container = this.parentNode;
    const afterElement = getDragAfterElement(container, e.clientY);
    
    if (afterElement) {
        container.insertBefore(draggingItem, afterElement);
    } else {
        container.appendChild(draggingItem);
    }
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.link-edit:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function handleEditorDrop(e) {
    e.preventDefault();
    // Update all indexes after drop
    document.querySelectorAll('.link-edit').forEach((item, index) => {
        item.dataset.index = index;
    });
}

let timerMode = 'pomodoro';
let timerDuration = 25 * 60; // 25 minutes in seconds
let breakDuration = 5 * 60;  // 5 minutes in seconds

function setTimerMode(mode) {
    timerMode = mode;
    if (mode === 'pomodoro') {
        timerDuration = 25 * 60;
        document.getElementById('pomodoro-btn').classList.add('active');
        document.getElementById('break-btn').classList.remove('active');
    } else {
        timerDuration = 5 * 60;
        document.getElementById('break-btn').classList.add('active');
        document.getElementById('pomodoro-btn').classList.remove('active');
    }
    updateTimerDisplay(timerDuration);
    stopTimer(); // Reset the timer when switching modes
}

function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    document.querySelector('.timer-display').textContent = display;
}

function stopTimer() {
    clearInterval(timer);
    clearInterval(timerAudioInterval);
    timerAudioInterval = null;
    isTimerRunning = false;
    document.getElementById('timer-toggle').textContent = 'Start';
    
    // Reset to the full duration of current mode
    timeLeft = timerDuration;
    updateTimerDisplay(timeLeft);
}

function toggleTimer() {
    const toggleBtn = document.getElementById('timer-toggle');
    
    if (isTimerRunning) {
        clearInterval(timer);
        isTimerRunning = false;
        toggleBtn.textContent = 'Start';
    } else {
        requestNotificationPermission().then(() => {
            startTimer();
        });
    }
}

function startTimer() {
    timer = setInterval(updateTimer, 1000);
    isTimerRunning = true;
    document.getElementById('timer-toggle').textContent = 'Pause';
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay(timeLeft);
    } else {
        // Timer finished
        clearInterval(timer);
        isTimerRunning = false;
        document.getElementById('timer-toggle').textContent = 'Start';
        
        playTimerCompleteSound();
        
        // Send notification
        sendNotification(
            `${timerMode === 'pomodoro' ? 'Focus' : 'Break'} time is up!`,
            `Time to ${timerMode === 'pomodoro' ? 'take a break' : 'focus again'}!`
        );
        
        // Switch modes automatically
        setTimerMode(timerMode === 'pomodoro' ? 'break' : 'pomodoro');
    }
}

// Add this function to handle notification permission
async function requestNotificationPermission() {
    // Check if we already asked
    const askedBefore = localStorage.getItem('notificationAsked') === 'true';
    
    // If permission is already granted or denied, don't ask again
    if (Notification.permission === 'granted' || Notification.permission === 'denied') {
        return Notification.permission;
    }
    
    // If we haven't asked before, show the explanation
    if (!askedBefore) {
        return new Promise((resolve) => {
            showNotificationExplanation(() => {
                Notification.requestPermission().then(permission => {
                    localStorage.setItem('notificationAsked', 'true');
                    resolve(permission);
                });
            });
        });
    }
    
    return Notification.permission;
}

function showNotificationExplanation(onAllow) {
    const modal = document.createElement('div');
    modal.className = 'modal notification-modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content notification-content">
            <h3>Enable Notifications?</h3>
            <p>The study timer would like to send you a notification when your focus or break time is complete.</p>
            <p>This helps you stay on track even if you switch to another tab or application.</p>
            <div class="notification-buttons">
                <button id="notification-allow" class="notification-btn allow">Allow</button>
                <button id="notification-skip" class="notification-btn skip">Not Now</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('notification-allow').addEventListener('click', () => {
        document.body.removeChild(modal);
        onAllow();
    });
    
    document.getElementById('notification-skip').addEventListener('click', () => {
        document.body.removeChild(modal);
        localStorage.setItem('notificationAsked', 'true');
        startTimer();
    });
}

function sendNotification(title, body) {
    if (Notification.permission === "granted") {
        try {
            // Create and show the notification
            const notification = new Notification(title, {
                body: body,
                icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><path d=%22M50 15c-15 0-25 10-25 25v25l-10 10h70l-10-10V40c0-15-10-25-25-25z%22 fill=%22%236200ea%22/><path d=%22M50 85c5.5 0 10-4.5 10-10H40c0 5.5 4.5 10 10 10z%22 fill=%22%236200ea%22/><path d=%22M50 15c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z%22 fill=%22%236200ea%22/></svg>',
                requireInteraction: true,
                silent: true,
                tag: 'timer-notification' // Ensures only one notification is shown
            });
            
            notification.onclick = function() {
                window.focus();
                this.close();
            };
            
            // Ensure notification is shown even in background
            if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'showNotification',
                    title: title,
                    body: body
                });
            }
        } catch (error) {
            console.error('Failed to send notification:', error);
        }
    }
}

// Update the togglePomodoro function to properly handle sidebar visibility
function togglePomodoro() {
    const pomodoroToggle = document.getElementById('pomodoro-toggle');
    const pomodoro = document.getElementById('pomodoro');
    const schedule = document.querySelector('.schedule');
    
    localStorage.setItem('pomodoroEnabled', pomodoroToggle.checked);
    pomodoro.style.display = pomodoroToggle.checked ? 'block' : 'none';
    
    // Update the sidebar visibility based on any enabled feature
    const quickLinksEnabled = localStorage.getItem('quickLinksEnabled') === 'true';
    const quoteEnabled = localStorage.getItem('quoteEnabled') === 'true';
    
    if (pomodoroToggle.checked || quickLinksEnabled || quoteEnabled) {
        schedule.classList.add('with-quick-links');
    } else {
        schedule.classList.remove('with-quick-links');
    }
    
    // Stop timer if it's running when pomodoro is disabled
    if (!pomodoroToggle.checked && isTimerRunning) {
        clearInterval(timer);
        isTimerRunning = false;
        document.getElementById('timer-toggle').textContent = 'Start';
    }
}

// Add these CSS rules dynamically for current and next periods
function addPeriodStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .period.current-period {
            background-color: rgba(98, 0, 234, 0.1);
            border-left: 4px solid var(--primary-color);
            font-weight: 600;
        }
        
        .period.next-period {
            background-color: rgba(98, 0, 234, 0.05);
            border-left: 4px solid rgba(98, 0, 234, 0.5);
        }
    `;
    document.head.appendChild(style);
}

// Add this function to create a better timer sound
function playTimerCompleteSound() {
    if (timerAudioInterval) return; // Don't start if already playing
    
    function playSound() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        
        function createOscillator(freq, type, startTime, duration) {
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.type = type;
            oscillator.frequency.value = freq;
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
            gainNode.gain.setValueAtTime(0.3, startTime + duration - 0.05);
            gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        }
        
        const now = audioCtx.currentTime;
        
        createOscillator(523.25, 'sine', now, 0.2);      // C5
        createOscillator(659.25, 'sine', now + 0.25, 0.2); // E5
        createOscillator(783.99, 'sine', now + 0.5, 0.4);  // G5
        
        const backgroundOsc = audioCtx.createOscillator();
        const backgroundGain = audioCtx.createGain();
        
        backgroundOsc.type = 'sine';
        backgroundOsc.frequency.value = 261.63; // C4
        
        backgroundGain.gain.setValueAtTime(0, now);
        backgroundGain.gain.linearRampToValueAtTime(0.1, now + 0.1);
        backgroundGain.gain.linearRampToValueAtTime(0, now + 0.9);
        
        backgroundOsc.connect(backgroundGain);
        backgroundGain.connect(audioCtx.destination);
        
        backgroundOsc.start(now);
        backgroundOsc.stop(now + 0.9);
    }
    
    playSound(); // Play immediately
    timerAudioInterval = setInterval(playSound, 2000); // Repeat every 2 seconds
}

// Update schedulePageRefreshes function to use TIME_SETTINGS
function schedulePageRefreshes() {
    function scheduleRefresh(hour) {
        const now = new Date();
        const nextRefresh = new Date(now);
        nextRefresh.setHours(hour, 0, 0, 0);
        
        // If the time has already passed today, schedule for tomorrow
        if (now > nextRefresh) {
            nextRefresh.setDate(nextRefresh.getDate() + 1);
        }
        
        const timeUntilRefresh = nextRefresh.getTime() - now.getTime();
        setTimeout(() => {
            window.location.reload();
            // Schedule the next refresh after this one
            scheduleRefresh(hour);
        }, timeUntilRefresh);
    }

    // Schedule refreshes at configured times
    TIME_SETTINGS.REFRESH_TIMES.forEach(hour => scheduleRefresh(hour));
}

// Add to window.onload
window.onload = function() {
    // ... existing code ...
    initializeUser();
    initializeTheme();
    loadNotes();
    loadQuickLinks();
    loadQuote();
    addPeriodStyles();
    schedulePageRefreshes();  // Add this line
    // ... existing code ...
};

function skipName() {
    document.getElementById('welcome-modal').style.display = 'none';
    // Set a flag in localStorage to indicate user has completed onboarding
    localStorage.setItem('onboardingComplete', 'true');
    updateGreeting();
}

function addQuickLink() {
    const editor = document.querySelector('.quick-links-editor');
    const index = document.querySelectorAll('.link-edit').length;
    
    const newLink = document.createElement('div');
    newLink.className = 'link-edit';
    newLink.dataset.index = index;
    newLink.innerHTML = `
        <input type="text" placeholder="Title" class="link-title">
        <input type="text" placeholder="URL" class="link-url">
        <button onclick="deleteQuickLink(${index})" class="clear-btn">×</button>
        <span class="drag-handle">⋮⋮</span>
    `;
    
    editor.appendChild(newLink);
    setupEditorDragAndDrop(editor); // Refresh drag and drop handlers
}

function deleteQuickLink(index) {
    const linkElement = document.querySelector(`.link-edit[data-index="${index}"]`);
    if (linkElement) {
        linkElement.remove();
        // Update remaining indexes
        document.querySelectorAll('.link-edit').forEach((item, idx) => {
            item.dataset.index = idx;
        });
    }
}

function saveQuickLinks() {
    const links = [];
    document.querySelectorAll('.link-edit').forEach(linkEdit => {
        const title = linkEdit.querySelector('.link-title').value.trim();
        let url = linkEdit.querySelector('.link-url').value.trim();
        
        if (title && url) {
            links.push({ 
                title, 
                url: ensureHttps(url)
            });
        }
    });
    
    localStorage.setItem('quickLinks', JSON.stringify(links));
    loadQuickLinks();
    closeQuickLinksEditor();
}

function closeQuickLinksEditor() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

function resetAllSettings() {
    if (confirm('Are you sure you want to reset all settings? This action cannot be undone.')) {
        // Wipe all local and session storage
        localStorage.clear();
        sessionStorage.clear();
        // Reload the page immediately to prevent scripts from re-setting storage
        location.reload();
    }
}

// Add function to make timer duration editable
function makeTimerEditable() {
    const timerDisplay = document.querySelector('.timer-display');
    
    // Create input element
    const input = document.createElement('input');
    input.type = 'text';
    input.value = formatTime(timeLeft);
    input.className = 'timer-input';
    input.style.width = '100%';
    input.style.background = 'transparent';
    input.style.border = 'none';
    input.style.fontSize = 'inherit';
    input.style.textAlign = 'center';
    input.style.color = 'inherit';
    input.style.fontFamily = 'inherit';
    
    // Replace display with input
    timerDisplay.textContent = '';
    timerDisplay.appendChild(input);
    input.focus();
    input.select();
    
    let inputBuffer = '';
    
    // Handle input changes
    input.addEventListener('input', (e) => {
        // Remove any non-numeric characters
        const digit = e.target.value.replace(/[^0-9]/g, '');
        
        // Add the last typed digit to our buffer
        if (digit.length > 0) {
            inputBuffer += digit.slice(-1);
        }
        
        // Keep only the last 4 digits
        inputBuffer = inputBuffer.slice(-4);
        
        // Format the display like a microwave
        let display = '00:00';
        if (inputBuffer.length > 0) {
            const padded = inputBuffer.padStart(4, '0');
            display = padded.slice(0, 2) + ':' + padded.slice(2);
        }
        
        input.value = display;
        
        // Position cursor at the end
        input.setSelectionRange(display.length, display.length);
    });
    
    // Handle backspace
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            inputBuffer = inputBuffer.slice(0, -1);
            let display = '00:00';
            if (inputBuffer.length > 0) {
                const padded = inputBuffer.padStart(4, '0');
                display = padded.slice(0, 2) + ':' + padded.slice(2);
            }
            input.value = display;
        }
    });
    
    // Handle input completion
    function handleInput() {
        if (inputBuffer.length === 0) {
            timerDisplay.removeChild(input);
            updateTimerDisplay(timeLeft);
            return;
        }
        
        const padded = inputBuffer.padStart(4, '0');
        const minutes = parseInt(padded.slice(0, 2));
        const seconds = parseInt(padded.slice(2));
        
        if (seconds < 60) {
            const totalSeconds = (minutes * 60) + seconds;
            if (totalSeconds > 0) {
                if (timerMode === 'pomodoro') {
                    timerDuration = totalSeconds;
                } else {
                    breakDuration = totalSeconds;
                }
                timeLeft = totalSeconds;
                
                // Save to localStorage
                localStorage.setItem('timerDurations', JSON.stringify({
                    pomodoro: timerDuration,
                    break: breakDuration
                }));
            }
        }
        
        timerDisplay.removeChild(input)

// Function to load the ad script
function loadAdScript() {
    // If the script already exists, don't add it again
    if (document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
        return;
    }
    const adScript = document.createElement('script');
    adScript.async = true;
    adScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6495491558279009";
    adScript.crossOrigin = "anonymous";
    document.head.appendChild(adScript);
}

// Load the ad script when the page loads
window.addEventListener('load', loadAdScript);;
        updateTimerDisplay(timeLeft);
    }
    
    input.addEventListener('blur', handleInput);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleInput();
        }
    });
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Update the initialization code
document.addEventListener('DOMContentLoaded', function() {
    // Load saved timer durations
    const savedDurations = localStorage.getItem('timerDurations');
    if (savedDurations) {
        const durations = JSON.parse(savedDurations);
        timerDuration = durations.pomodoro;
        breakDuration = durations.break;
        timeLeft = timerDuration;
        updateTimerDisplay(timeLeft);
    }
    
    // Initialize notification system
    if ('Notification' in window) {
        const askedBefore = localStorage.getItem('notificationAsked') === 'true';
        if (askedBefore && Notification.permission === 'default') {
            localStorage.removeItem('notificationAsked');
        }
    }
    
    // Add click handler for timer display
    const timerDisplay = document.querySelector('.timer-display');
    timerDisplay.addEventListener('click', function() {
        if (!isTimerRunning) {
            makeTimerEditable();
        }
    });
});

function toggleQuote() {
    const quoteToggle = document.getElementById('quote-toggle');
    const quote = document.getElementById('quote-of-day');
    const schedule = document.querySelector('.schedule');
    
    localStorage.setItem('quoteEnabled', quoteToggle.checked);
    quote.style.display = quoteToggle.checked ? 'block' : 'none';
    
    // Update the sidebar visibility based on any enabled feature
    const quickLinksEnabled = localStorage.getItem('quickLinksEnabled') === 'true';
    const pomodoroEnabled = localStorage.getItem('pomodoroEnabled') === 'true';
    
    if (quoteToggle.checked || quickLinksEnabled || pomodoroEnabled) {
        schedule.classList.add('with-quick-links');
    } else {
        schedule.classList.remove('with-quick-links');
    }

    if (quoteToggle.checked) {
        fetchQuote();
    }
}

// Exam Tracker Functions
function toggleExamTracker() {
    const examToggle = document.getElementById('exam-tracker-toggle');
    const examTracker = document.getElementById('exam-tracker');
    const schedule = document.querySelector('.schedule');
    
    localStorage.setItem('examTrackerEnabled', examToggle.checked);
    examTracker.style.display = examToggle.checked ? 'block' : 'none';
    
    // Update the sidebar visibility based on any enabled feature
    const quickLinksEnabled = localStorage.getItem('quickLinksEnabled') === 'true';
    const pomodoroEnabled = localStorage.getItem('pomodoroEnabled') === 'true';
    const quoteEnabled = localStorage.getItem('quoteEnabled') === 'true';
    
    if (examToggle.checked || quickLinksEnabled || pomodoroEnabled || quoteEnabled) {
        schedule.classList.add('with-quick-links');
    } else {
        schedule.classList.remove('with-quick-links');
    }

    if (examToggle.checked) {
        loadExams();
        updateExamStats();
    }
}

function openExamModal() {
    document.getElementById('exam-modal').style.display = 'block';
    // Set default date to today
    document.getElementById('exam-date').value = new Date().toISOString().split('T')[0];
}

function closeExamModal() {
    document.getElementById('exam-modal').style.display = 'none';
    // Clear form
    document.getElementById('exam-subject').value = '';
    document.getElementById('exam-title').value = '';
    document.getElementById('exam-score').value = '';
    document.getElementById('exam-max-score').value = '100';
    document.getElementById('exam-date').value = '';
    document.getElementById('exam-notes').value = '';
}

function saveExam() {
    const subject = document.getElementById('exam-subject').value.trim();
    const title = document.getElementById('exam-title').value.trim();
    const score = parseFloat(document.getElementById('exam-score').value);
    const maxScore = parseFloat(document.getElementById('exam-max-score').value);
    const weight = parseFloat(document.getElementById('exam-weight').value);
    const date = document.getElementById('exam-date').value;
    const notes = document.getElementById('exam-notes').value.trim();
    
    if (!subject || !title || isNaN(score) || isNaN(maxScore) || isNaN(weight) || !date) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (score < 0 || score > maxScore) {
        alert('Score must be between 0 and ' + maxScore);
        return;
    }
    if (weight < 1 || weight > 100) {
        alert('Weight must be between 1 and 100');
        return;
    }
    
    const exam = {
        id: Date.now(),
        subject: subject,
        title: title,
        score: score,
        maxScore: maxScore,
        percentage: Math.round((score / maxScore) * 100),
        weight: weight,
        date: date,
        notes: notes,
        timestamp: new Date().toISOString()
    };
    
    const exams = getExams();
    exams.push(exam);
    saveExams(exams);
    
    closeExamModal();
    loadExams();
    updateExamStats();
}

function getExams() {
    const examsData = localStorage.getItem('exams');
    return examsData ? JSON.parse(examsData) : [];
}

function saveExams(exams) {
    localStorage.setItem('exams', JSON.stringify(exams));
}

function loadExams() {
    const exams = getExams();
    const examList = document.getElementById('exam-list');
    
    if (!examList) return;
    
    if (exams.length === 0) {
        examList.innerHTML = '<p class="no-exams">No exams added yet</p>';
        return;
    }
    
    // Sort exams by date (newest first)
    const sortedExams = exams.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Show only the 5 most recent exams in the sidebar
    const recentExams = sortedExams.slice(0, 5);
    
    examList.innerHTML = recentExams.map(exam => `
        <div class="exam-item">
            <div class="exam-info">
                <div class="exam-subject">${exam.subject}</div>
                <div class="exam-title">${exam.title}</div>
                <div class="exam-weight">Weight: ${exam.weight || 100}%</div>
            </div>
            <div class="exam-score">${exam.percentage}%</div>
        </div>
    `).join('');
}

function updateExamStats() {
    const exams = getExams();
    const avgScoreElement = document.getElementById('avg-score');
    const totalExamsElement = document.getElementById('total-exams');
    
    if (!avgScoreElement || !totalExamsElement) return;
    
    if (exams.length === 0) {
        avgScoreElement.textContent = '--';
        totalExamsElement.textContent = '0';
        return;
    }
    
    // Weighted average calculation
    let weightedSum = 0;
    let totalWeight = 0;
    exams.forEach(exam => {
        weightedSum += exam.percentage * (exam.weight || 100);
        totalWeight += (exam.weight || 100);
    });
    const avgScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
    
    avgScoreElement.textContent = avgScore + '%';
    totalExamsElement.textContent = exams.length;
}

function viewExamStats() {
    // Always show the stats modal first
    const statsModal = document.getElementById('exam-stats-modal');
    if (statsModal) statsModal.style.display = 'block';
    // Now update stats if elements exist
    const exams = getExams();
    if (exams.length === 0) {
        alert('No exams to display');
        return;
    }
    // Weighted average calculation
    let weightedSum = 0;
    let totalWeight = 0;
    exams.forEach(exam => {
        weightedSum += exam.percentage * (exam.weight || 100);
        totalWeight += (exam.weight || 100);
    });
    const avgScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
    const highestScore = Math.max(...exams.map(exam => exam.percentage));
    const lowestScore = Math.min(...exams.map(exam => exam.percentage));
    
    document.getElementById('stats-avg-score').textContent = avgScore + '%';
    document.getElementById('stats-total-exams').textContent = exams.length;
    document.getElementById('stats-highest-score').textContent = highestScore + '%';
    document.getElementById('stats-lowest-score').textContent = lowestScore + '%';
    
    // Generate subject breakdown (weighted)
    const subjectStats = {};
    exams.forEach(exam => {
        if (!subjectStats[exam.subject]) {
            subjectStats[exam.subject] = { sum: 0, weight: 0, count: 0 };
        }
        subjectStats[exam.subject].sum += exam.percentage * (exam.weight || 100);
        subjectStats[exam.subject].weight += (exam.weight || 100);
        subjectStats[exam.subject].count += 1;
    });
    const subjectStatsHtml = Object.entries(subjectStats).map(([subject, data]) => {
        const avg = data.weight > 0 ? Math.round(data.sum / data.weight) : 0;
        return `
            <div class=\"subject-stat clickable\" onclick=\"showSubjectAnalytics('${subject.replace(/'/g, "\\'")}')\">
                <div class=\"subject-name\">${subject}</div>
                <div class=\"subject-avg\">${avg}% (${data.count} exam${data.count > 1 ? 's' : ''})</div>
            </div>
        `;
    }).join('');
    // Only update if elements exist
    const subjectStatsElem = document.getElementById('subject-stats');
    if (subjectStatsElem) subjectStatsElem.innerHTML = subjectStatsHtml;
    
    // Generate subject averages dashboard
    const subjectAverages = {};
    exams.forEach(exam => {
        if (!subjectAverages[exam.subject]) {
            subjectAverages[exam.subject] = { sum: 0, weight: 0 };
        }
        subjectAverages[exam.subject].sum += exam.percentage * (exam.weight || 100);
        subjectAverages[exam.subject].weight += (exam.weight || 100);
    });
    const subjectAveragesHtml = Object.entries(subjectAverages).map(([subject, data]) => {
        const avg = data.weight > 0 ? Math.round(data.sum / data.weight) : 0;
        return `<div class='subject-averages-card'><div class='subject-averages-card-label'>${subject}</div><div class='subject-averages-card-value'>${avg}%</div></div>`;
    }).join('');
    // Only update if elements exist
    const subjectAveragesCardsElem = document.getElementById('subject-averages-cards');
    if (subjectAveragesCardsElem) subjectAveragesCardsElem.innerHTML = subjectAveragesHtml;
    
    // Generate timeline chart
    const sortedExams = exams.sort((a, b) => new Date(a.date) - new Date(b.date));
    const timelineHtml = sortedExams.map(exam => {
        const height = (exam.percentage / 100) * 150; // Max height 150px
        const date = new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return `
            <div class="timeline-bar" style="height: ${height}px;" title="${exam.subject} - ${exam.title}: ${exam.percentage}%">
                <div class="timeline-label">${date}</div>
            </div>
        `;
    }).join('');
    
    document.getElementById('exam-timeline').innerHTML = timelineHtml;
    
    // Generate full exam list
    let fullExamListHtml = '';
    if (sortedExams.length === 0) {
        fullExamListHtml = `<div class='no-exams'>No exams found.</div>`;
    } else {
        fullExamListHtml = sortedExams.reverse().map(exam => {
            const date = new Date(exam.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
            return `
                <div class="full-exam-item">
                    <div class="full-exam-info">
                        <div class="full-exam-subject">${exam.subject}</div>
                        <div class="full-exam-title">${exam.title}</div>
                        <div class="full-exam-date">${date}</div>
                        <div class="full-exam-weight">Weight: ${exam.weight || 100}%</div>
                    </div>
                    <div class="full-exam-score">${exam.percentage}%</div>
                    <button class="delete-exam-btn" onclick="deleteExam(${exam.id})">Delete</button>
                </div>
            `;
        }).join('');
    }
    const fullExamListElem = document.getElementById('full-exam-list');
    if (fullExamListElem) fullExamListElem.innerHTML = fullExamListHtml;
}

function closeExamStatsModal() {
    document.getElementById('exam-stats-modal').style.display = 'none';
}

function deleteExam(examId) {
    if (confirm('Are you sure you want to delete this exam?')) {
        const exams = getExams();
        const updatedExams = exams.filter(exam => exam.id !== examId);
        saveExams(updatedExams);
        loadExams();
        updateExamStats();
        viewExamStats(); // Refresh the stats modal
    }
}

async function fetchQuote() {
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const quoteContent = document.querySelector('.quote-content');
    const refreshButton = document.querySelector('.refresh-quote');
    
    if (!quoteText || !quoteAuthor || !quoteContent) return;
    
    try {
        // Disable refresh button and add loading state
        if (refreshButton) {
            refreshButton.disabled = true;
            refreshButton.style.opacity = '0.5';
        }
        quoteContent.classList.add('loading');
        
        // Get a random quote from our local collection
        const quote = getRandomQuote();
        
        // Animate the new quote
        quoteContent.style.opacity = '0';
        setTimeout(() => {
            quoteText.textContent = quote.text;
            quoteAuthor.textContent = quote.author;
            quoteContent.style.opacity = '1';
        }, 200);
        
        // Save the quote to localStorage
        localStorage.setItem('lastQuote', JSON.stringify({
            text: quote.text,
            author: quote.author,
            date: new Date().toDateString()
        }));
    } catch (error) {
        console.error('Error displaying quote:', error);
        // Only show fallback if there's no existing quote
        if (!quoteText.textContent) {
            quoteText.textContent = 'Knowledge is power.';
            quoteAuthor.textContent = 'Francis Bacon';
        }
    } finally {
        // Re-enable refresh button and remove loading state
        if (refreshButton) {
            refreshButton.disabled = false;
            refreshButton.style.opacity = '1';
        }
        quoteContent.classList.remove('loading');
    }
}

function loadQuote() {
    const quoteEnabled = localStorage.getItem('quoteEnabled') === 'true';
    const quoteToggle = document.getElementById('quote-toggle');
    const quote = document.getElementById('quote-of-day');
    
    if (!quoteToggle || !quote) return;
    
    // Set the toggle state
    quoteToggle.checked = quoteEnabled;
    quote.style.display = quoteEnabled ? 'block' : 'none';
    
    if (quoteEnabled) {
        // Check if we already have a quote for today
        const lastQuote = JSON.parse(localStorage.getItem('lastQuote'));
        const now = new Date().toDateString();
        
        if (lastQuote && lastQuote.date === now) {
            const quoteText = document.getElementById('quote-text');
            const quoteAuthor = document.getElementById('quote-author');
            if (quoteText && quoteAuthor) {
                quoteText.textContent = lastQuote.text;
                quoteAuthor.textContent = lastQuote.author;
            }
        } else {
            fetchQuote();
        }
    }
}

// Add CSS transition for quote content
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .quote-content {
            transition: opacity 0.2s ease-in-out;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize quote functionality
    loadQuote();
});

// Add drag and drop functionality
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    let draggingElem = null;
    let placeholder = null;
    let isDragging = false;
    let startY;
    let startScrollY;

    // Save tile order to localStorage
    function saveTileOrder() {
        const sidebar = document.querySelector('.sidebar');
        const tiles = Array.from(sidebar.children).map(tile => {
            // Get the data-tile-type attribute or fallback to element id
            return tile.dataset.tileType || tile.id;
        });
        localStorage.setItem('tileOrder', JSON.stringify(tiles));
    }

    // Load tile order from localStorage
    function loadTileOrder() {
        const savedOrder = localStorage.getItem('tileOrder');
        if (!savedOrder) return;

        const sidebar = document.querySelector('.sidebar');
        const tiles = JSON.parse(savedOrder);
        
        // Reorder the tiles based on saved order
        tiles.forEach(tileId => {
            const tile = sidebar.querySelector(`[data-tile-type="${tileId}"], #${tileId}`);
            if (tile) {
                sidebar.appendChild(tile);
            }
        });
    }

    // Add drag indicators to tiles
    function initializeDragHandles() {
        const sidebar = document.querySelector('.sidebar');
        const tiles = sidebar.children;

        Array.from(tiles).forEach(tile => {
            // Create drag handle if it doesn't exist
            if (!tile.querySelector('.drag-indicator')) {
                const dragHandle = document.createElement('div');
                dragHandle.className = 'drag-indicator';
                dragHandle.innerHTML = '⋮⋮';
                tile.insertBefore(dragHandle, tile.firstChild);
            }
        });

        // Add drag and drop event listeners
        sidebar.addEventListener('dragstart', handleEditorDragStart);
        sidebar.addEventListener('dragend', handleEditorDragEnd);
        sidebar.addEventListener('dragover', handleEditorDragOver);
        sidebar.addEventListener('drop', handleEditorDrop);

        // Make tiles draggable
        Array.from(tiles).forEach(tile => {
            tile.draggable = true;
        });
    }

    sidebar.addEventListener('dragstart', (e) => {
        draggingElem = e.target;
        draggingElem.classList.add('dragging');
        
        placeholder = document.createElement('div');
        placeholder.className = 'drag-placeholder';
        draggingElem.parentNode.insertBefore(placeholder, draggingElem.nextSibling);
        
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');
    });

    sidebar.addEventListener('dragend', () => {
        draggingElem.classList.remove('dragging');
        placeholder.parentNode.insertBefore(draggingElem, placeholder);
        placeholder.remove();
        saveTileOrder();
    });

    sidebar.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(sidebar, e.clientY);
        
        if (afterElement) {
            sidebar.insertBefore(placeholder, afterElement);
        } else {
            sidebar.appendChild(placeholder);
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('div:not(.dragging):not(.drag-placeholder)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Initialize drag handles and load saved order
    initializeDragHandles();
    loadTileOrder();
});

// ... existing code ...

// Games functions
let isGameFullscreen = false;

function toggleGames() {
    const gamesTile = document.getElementById('games-tile');
    const isChecked = document.getElementById('games-toggle').checked;
    
    gamesTile.style.display = isChecked ? 'block' : 'none';
    
    // Save preference
    localStorage.setItem('gamesEnabled', isChecked.toString());
}

function openGamesModal() {
    const gamesModal = document.getElementById('games-modal');
    gamesModal.style.display = 'flex';
    
    // Add click event to game cards if not already added
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        if (!card.dataset.eventAdded) {
            card.addEventListener('click', () => {
                const gameUrl = card.dataset.gameUrl;
                openGamePlayer(gameUrl);
            });
            card.dataset.eventAdded = 'true';
        }
    });
}

function toggleGamesModal() {
    const gamesModal = document.getElementById('games-modal');
    if (gamesModal.style.display === 'flex') {
        gamesModal.style.display = 'none';
    } else {
        gamesModal.style.display = 'flex';
    }
}

// Updated openGamePlayer function
function openGamePlayer(gameUrl) {
    // Hide games modal
    document.getElementById('games-modal').style.display = 'none';
    
    // Show game player modal
    const gamePlayerModal = document.getElementById('game-player-modal');
    gamePlayerModal.style.display = 'flex';
    
    // Set iframe source
    const gameIframe = document.getElementById('game-iframe');
    
    // Add zoom for Wordle
    if (gameUrl.includes('wordle')) {
        gameUrl += '#zoom=150%';
    }
    
    gameIframe.src = gameUrl;
    
    // Add focus to iframe for immediate keyboard control
    setTimeout(() => {
        gameIframe.focus();
        
        // Try to simulate a click on the iframe to activate keyboard controls
        try {
            const iframeDoc = gameIframe.contentDocument || gameIframe.contentWindow.document;
            iframeDoc.body.click();
        } catch (e) {
            console.log('Cannot access iframe content due to same-origin policy');
        }
    }, 500);
}

// Updated Game Player Modal HTML
function closeGamePlayer() {
    // Hide game player modal
    document.getElementById('game-player-modal').style.display = 'none';
    
    // Clear iframe src to stop game
    document.getElementById('game-iframe').src = '';
}

// Load games preferences
function loadGamesPreferences() {
    const isGamesEnabled = localStorage.getItem('gamesEnabled') === 'true';
    document.getElementById('games-toggle').checked = isGamesEnabled;
    document.getElementById('games-tile').style.display = isGamesEnabled ? 'block' : 'none';
}

// Escape key handler for game player
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && document.getElementById('game-player-modal').style.display === 'flex') {
        closeGamePlayer();
    }
});

// Initialize games feature
function initializeGames() {
    loadGamesPreferences();
    
    // Ensure modals are set up correctly
    document.getElementById('games-modal').style.display = 'none';
    document.getElementById('game-player-modal').style.display = 'none';
}

// Function to update sidebar visibility based on all enabled features
function updateSidebarVisibility() {
    const schedule = document.querySelector('.schedule');
    const quickLinksEnabled = localStorage.getItem('quickLinksEnabled') === 'true';
    const pomodoroEnabled = localStorage.getItem('pomodoroEnabled') === 'true';
    const quoteEnabled = localStorage.getItem('quoteEnabled') === 'true';
    const examTrackerEnabled = localStorage.getItem('examTrackerEnabled') === 'true';
    
    if (quickLinksEnabled || pomodoroEnabled || quoteEnabled || examTrackerEnabled) {
        schedule.classList.add('with-quick-links');
    } else {
        schedule.classList.remove('with-quick-links');
    }
}

// Update loadQuickLinks to use the new updateSidebarVisibility function
function loadQuickLinks() {
    const quickLinksEnabled = localStorage.getItem('quickLinksEnabled') === 'true';
    const pomodoroEnabled = localStorage.getItem('pomodoroEnabled') === 'true';
    const quoteEnabled = localStorage.getItem('quoteEnabled') === 'true';
    const examTrackerEnabled = localStorage.getItem('examTrackerEnabled') === 'true';
    const quickLinksToggle = document.getElementById('quick-links-toggle');
    const pomodoroToggle = document.getElementById('pomodoro-toggle');
    const quoteToggle = document.getElementById('quote-toggle');
    const examTrackerToggle = document.getElementById('exam-tracker-toggle');
    const quickLinks = document.getElementById('quick-links');
    const pomodoro = document.getElementById('pomodoro');
    const quote = document.getElementById('quote-of-day');
    const examTracker = document.getElementById('exam-tracker');
    const quickLinksList = document.querySelector('.quick-links-list');
    
    // Set the toggle states
    quickLinksToggle.checked = quickLinksEnabled;
    pomodoroToggle.checked = pomodoroEnabled;
    quoteToggle.checked = quoteEnabled;
    examTrackerToggle.checked = examTrackerEnabled;
    
    // Update displays
    quickLinks.style.display = quickLinksEnabled ? 'block' : 'none';
    pomodoro.style.display = pomodoroEnabled ? 'block' : 'none';
    quote.style.display = quoteEnabled ? 'block' : 'none';
    examTracker.style.display = examTrackerEnabled ? 'block' : 'none';
    
    // Update sidebar visibility
    updateSidebarVisibility();
    
    // Load saved links or use defaults
    const savedLinks = JSON.parse(localStorage.getItem('quickLinks')) || defaultQuickLinks;
    quickLinksList.innerHTML = savedLinks.map((link) => `
        <a href="${ensureHttps(link.url)}" class="quick-link" target="_blank">
            ${link.title}
        </a>
    `).join('');
    
    // Load exam tracker data if enabled
    if (examTrackerEnabled) {
        loadExams();
        updateExamStats();
    }
}

// Call updateSidebarVisibility when the page loads
document.addEventListener('DOMContentLoaded', function() {
    updateSidebarVisibility();
});

// Check if user is first time visitor
function checkFirstTimeUser() {
    // First-time/setup redirect disabled: always stay on main page
    return;
}

// Handle setup process
function handleSetup() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('setup') === 'true') {
        // Show setup modal
        showSetupModal();
    }
}

// Show setup modal
function showSetupModal() {
    // Remove any existing modal
    const oldModal = document.querySelector('.modal');
    if (oldModal) oldModal.remove();
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content setup-modal" style="max-width: 600px;">
            <h3>Welcome to Baulko Bell Times!</h3>
            <p>Let's get you set up step by step.</p>
            <div class="setup-steps">
                <div class="setup-step" id="name-step">
                    <h4>Step 1: Enter Your Name</h4>
                    <p>Personalize your experience by adding your name.</p>
                    <div class="setup-input">
                        <input type="text" id="setup-name" placeholder="Enter your name" class="name-input">
                        <button id="save-name-btn" class="setup-btn">Save Name</button>
                    </div>
                </div>
                <div class="setup-step" id="timetable-step" style="display: none;">
                    <h4>Step 2: Import Your Timetable</h4>
                    <p>Start by importing your school timetable to get your schedule set up.</p>
                    <div class="setup-input">
                        <input type="file" id="timetable-file" accept=".csv,.json" class="file-input">
                        <button id="upload-timetable-btn" class="setup-btn">Upload Timetable</button>
                    </div>
                </div>
                <div class="setup-step" id="theme-step" style="display: none;">
                    <h4>Step 3: Choose Your Theme</h4>
                    <p>Select a theme that matches your style.</p>
                    <div class="theme-grid setup-theme-grid">
                        <button data-theme="default" class="theme-btn default-theme"><span class="theme-preview"></span>Default</button>
                        <button data-theme="dark" class="theme-btn dark-theme"><span class="theme-preview"></span>Dark</button>
                        <button data-theme="light" class="theme-btn light-theme"><span class="theme-preview"></span>Light</button>
                        <button data-theme="purple" class="theme-btn purple-theme"><span class="theme-preview"></span>Purple</button>
                        <button data-theme="green" class="theme-btn green-theme"><span class="theme-preview"></span>Green</button>
                        <button data-theme="ocean" class="theme-btn ocean-theme"><span class="theme-preview"></span>Ocean</button>
                        <button data-theme="sunset" class="theme-btn sunset-theme"><span class="theme-preview"></span>Sunset</button>
                        <button data-theme="minimal" class="theme-btn minimal-theme"><span class="theme-preview"></span>Minimal</button>
                        <button data-theme="retro" class="theme-btn retro-theme"><span class="theme-preview"></span>Retro</button>
                        <button data-theme="forest" class="theme-btn forest-theme"><span class="theme-preview"></span>Forest</button>
                        <button data-theme="candy" class="theme-btn candy-theme"><span class="theme-preview"></span>Candy</button>
                        <button data-theme="coffee" class="theme-btn coffee-theme"><span class="theme-preview"></span>Coffee</button>
                        <button data-theme="mint" class="theme-btn mint-theme"><span class="theme-preview"></span>Mint</button>
                        <button data-theme="coral" class="theme-btn coral-theme"><span class="theme-preview"></span>Coral</button>
                        <button data-theme="lavender" class="theme-btn lavender-theme"><span class="theme-preview"></span>Lavender</button>
                    </div>
                    <h4>Dynamic Themes</h4>
                    <div class="theme-grid setup-theme-grid">
                        <button data-theme="time" class="theme-btn dynamic-time-theme"><span class="theme-preview"></span>Time Based</button>
                        <button data-theme="season" class="theme-btn dynamic-season-theme"><span class="theme-preview"></span>Seasonal</button>
                        <button data-theme="study" class="theme-btn dynamic-study-theme"><span class="theme-preview"></span>Study Focus</button>
                        <button data-theme="energy" class="theme-btn dynamic-energy-theme"><span class="theme-preview"></span>Energy</button>
                    </div>
                    <button id="save-theme-btn" class="setup-btn" style="margin-top: 1rem;">Save Theme</button>
                </div>
                <div class="setup-step" id="extension-step" style="display: none;">
                    <h4>Step 4: Chrome Extension</h4>
                    <p>Get instant access to your schedule with our Chrome extension.</p>
                    <div class="extension-steps">
                        <ol>
                            <li>Visit the Chrome Web Store</li>
                            <li>Search for "Baulko Bell Times"</li>
                            <li>Click "Add to Chrome"</li>
                            <li>Enjoy quick access to your schedule!</li>
                        </ol>
                    </div>
                    <button id="complete-setup-btn" class="setup-btn">Complete Setup</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Name step
    document.getElementById('save-name-btn').onclick = function() {
        const name = document.getElementById('setup-name').value.trim();
        if (name) {
            localStorage.setItem('userName', name);
            document.getElementById('name-step').style.display = 'none';
            document.getElementById('timetable-step').style.display = 'block';
        }
    };
    // Timetable step
    document.getElementById('upload-timetable-btn').onclick = function() {
        const fileInput = document.getElementById('timetable-file');
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const timetable = JSON.parse(e.target.result);
                    localStorage.setItem('timetable', JSON.stringify(timetable));
                    document.getElementById('timetable-step').style.display = 'none';
                    document.getElementById('theme-step').style.display = 'block';
                } catch (error) {
                    alert('Invalid timetable file. Please try again.');
                }
            };
            reader.readAsText(file);
        }
    };
    // Theme step
    let selectedTheme = null;
    document.querySelectorAll('.setup-theme-grid .theme-btn').forEach(btn => {
        btn.onclick = function() {
            document.querySelectorAll('.setup-theme-grid .theme-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedTheme = btn.getAttribute('data-theme');
        };
    });
    document.getElementById('save-theme-btn').onclick = function() {
        if (selectedTheme) {
            localStorage.setItem('selectedTheme', selectedTheme);
            if (typeof setTheme === 'function') setTheme(selectedTheme);
            document.getElementById('theme-step').style.display = 'none';
            document.getElementById('extension-step').style.display = 'block';
        }
    };
    // Extension step
    document.getElementById('complete-setup-btn').onclick = function() {
        localStorage.setItem('setupCompleted', 'true');
        // Remove ?setup from URL
        const url = new URL(window.location.href);
        url.searchParams.delete('setup');
        window.history.replaceState({}, '', url);
        modal.remove();
    };
}

window.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('setup') === 'true') {
        // Always show setup modal if ?setup=true
        showSetupModal();
        return;
    }
    // Setup completion check disabled: do not redirect to landing
});

window.addEventListener('DOMContentLoaded', function() {
    // Setup modal auto-display disabled
    return;
});

window.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('setupCompleted') && localStorage.getItem('firstTimeUser') === 'false' && !localStorage.getItem('homepageTooltipShown')) {
        // Show tooltip
        const tooltip = document.createElement('div');
        tooltip.id = 'homepage-tooltip';
        tooltip.style.position = 'fixed';
        tooltip.style.top = '24px';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.background = 'var(--card-background, #fff)';
        tooltip.style.color = 'var(--text-color, #333)';
        tooltip.style.border = '1.5px solid var(--primary-color, #6200ea)';
        tooltip.style.borderRadius = '12px';
        tooltip.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)';
        tooltip.style.padding = '1.2rem 2rem 1.2rem 1.5rem';
        tooltip.style.zIndex = '9999';
        tooltip.style.fontFamily = "'Montserrat', 'Open Sans', sans-serif";
        tooltip.style.fontSize = '1.05rem';
        tooltip.style.display = 'flex';
        tooltip.style.alignItems = 'center';
        tooltip.style.gap = '1rem';
        tooltip.innerHTML = `
            <span style="display: flex; align-items: center; gap: 0.5rem;">
                Click the <span class="material-icons" style="color: var(--primary-color, #6200ea); font-size: 1.3rem; vertical-align: middle;">settings</span> icon to customise themes, import your timetable, add your name, and install the Chrome extension.
            </span>
            <button id="close-tooltip-btn" style="background: none; border: none; color: var(--primary-color, #6200ea); font-size: 1.5rem; cursor: pointer; margin-left: 1rem;">&times;</button>
        `;
        document.body.appendChild(tooltip);
        document.getElementById('close-tooltip-btn').onclick = function() {
            tooltip.remove();
            localStorage.setItem('homepageTooltipShown', 'true');
        };
    }
});

// Modern settings modal tab navigation
window.addEventListener('DOMContentLoaded', function() {
    const navBtns = document.querySelectorAll('.settings-nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.getAttribute('data-tab');
            tabContents.forEach(tc => tc.classList.remove('active'));
            document.getElementById(tab + '-tab').classList.add('active');
        });
    });
});

// ... existing code ...
// Fix close button for settings modal
window.addEventListener('DOMContentLoaded', function() {
    var closeBtn = document.querySelector('#settings-modal .close-btn');
    if (closeBtn) {
        closeBtn.onclick = function(e) {
            e.stopPropagation();
            document.getElementById('settings-modal').style.display = 'none';
        };
    }
});
// ... existing code ...

function showSubjectAnalytics(subject) {
    const exams = getExams().filter(e => e.subject === subject);
    if (exams.length === 0) return;
    document.getElementById('subject-analytics-title').textContent = `Subject Analytics: ${subject}`;
    // Stats
    let weightedSum = 0, totalWeight = 0, highest = -Infinity, lowest = Infinity, mostRecent = null;
    exams.forEach(exam => {
        weightedSum += exam.percentage * (exam.weight || 100);
        totalWeight += (exam.weight || 100);
        if (exam.percentage > highest) highest = exam.percentage;
        if (exam.percentage < lowest) lowest = exam.percentage;
        if (!mostRecent || new Date(exam.date) > new Date(mostRecent.date)) mostRecent = exam;
    });
    const avg = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
    const statsHtml = `
        <div class='subject-analytics-stat'><div class='subject-analytics-stat-label'>Weighted Avg</div><div class='subject-analytics-stat-value'>${avg}%</div></div>
        <div class='subject-analytics-stat'><div class='subject-analytics-stat-label'>Highest</div><div class='subject-analytics-stat-value'>${highest}%</div></div>
        <div class='subject-analytics-stat'><div class='subject-analytics-stat-label'>Lowest</div><div class='subject-analytics-stat-value'>${lowest}%</div></div>
        <div class='subject-analytics-stat'><div class='subject-analytics-stat-label'>Most Recent</div><div class='subject-analytics-stat-value'>${mostRecent ? mostRecent.percentage + '%' : '--'}</div></div>
    `;
    document.getElementById('subject-analytics-stats').innerHTML = statsHtml;
    // List
    const listHtml = exams.sort((a, b) => new Date(b.date) - new Date(a.date)).map(exam => {
        const date = new Date(exam.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        return `
            <div class='subject-analytics-exam-item'>
                <div class='subject-analytics-exam-info'>
                    <div class='subject-analytics-exam-title'>${exam.title}</div>
                    <div class='subject-analytics-exam-date'>${date}</div>
                    <div class='subject-analytics-exam-weight'>Weight: ${exam.weight || 100}%</div>
                    ${exam.notes ? `<div class='subject-analytics-exam-notes'>${exam.notes}</div>` : ''}
                </div>
                <div class='subject-analytics-exam-score'>${exam.percentage}%</div>
                <button class='subject-analytics-edit-btn' onclick='editExam(${exam.id})'>Edit</button>
            </div>
        `;
    }).join('');
    document.getElementById('subject-analytics-list').innerHTML = listHtml;
    // Graph
    document.getElementById('subject-analytics-graph').innerHTML = renderSubjectGraph(exams);
    document.getElementById('subject-analytics-modal').style.display = 'block';
}
function closeSubjectAnalyticsModal() {
    document.getElementById('subject-analytics-modal').style.display = 'none';
}
function renderSubjectGraph(exams) {
    if (!exams.length) return '';
    // Sort by date ascending
    const sorted = exams.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    const n = sorted.length;
    const width = Math.max(340, 48 * (n-1) + 80); // min 340px, 48px per point
    const height = 220;
    const margin = { left: 44, right: 24, top: 30, bottom: 40 };
    // Y scale
    const minY = 0;
    const maxY = 100;
    const y = p => margin.top + (height - margin.top - margin.bottom) * (1 - p/100);
    // X scale
    const x = i => margin.left + i * ((width - margin.left - margin.right) / Math.max(1, n-1));
    // Smooth curve path
    function getSmoothPath(points) {
        if (points.length < 2) return '';
        let d = `M${points[0][0]},${points[0][1]}`;
        for (let i = 0; i < points.length-1; i++) {
            const [x1, y1] = points[i];
            const [x2, y2] = points[i+1];
            const mx = (x1 + x2) / 2;
            d += ` Q${mx},${y1} ${x2},${y2}`;
        }
        return d;
    }
    const points = sorted.map((exam, i) => [x(i), y(exam.percentage)]);
    const path = getSmoothPath(points);
    // Area fill under curve
    const areaPath = path + ` L${x(n-1)},${y(0)} L${x(0)},${y(0)} Z`;
    // Y gridlines and labels
    const gridYs = [100, 80, 60, 40, 20, 0];
    const gridLines = gridYs.map(val => `<line x1='${margin.left}' y1='${y(val)}' x2='${width-margin.right}' y2='${y(val)}' stroke='#e6dbfa' stroke-width='1'/><text x='${margin.left-10}' y='${y(val)+4}' font-size='12' fill='#888' text-anchor='end'>${val}%</text>`).join('');
    // X labels
    const labels = sorted.map((exam, i) => {
        const date = new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return `<text x='${x(i)}' y='${height-margin.bottom+20}' font-size='12' text-anchor='middle' fill='#666'>${date}</text>`;
    }).join('');
    // Dots with tooltips
    const circles = sorted.map((exam, i) => {
        return `<g>
            <circle cx='${x(i)}' cy='${y(exam.percentage)}' r='8' fill='white' stroke='var(--primary-color)' stroke-width='3'/>
            <circle cx='${x(i)}' cy='${y(exam.percentage)}' r='5' fill='var(--primary-color)'/>
            <title>${exam.title}: ${exam.percentage}%\n${new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</title>
        </g>`;
    }).join('');
    return `<svg width='100%' height='${height}' viewBox='0 0 ${width} ${height}' style='max-width:480px;'>
        <rect x='0' y='0' width='${width}' height='${height}' fill='none'/>
        ${gridLines}
        <path d='${areaPath}' fill='url(#subjectAreaGradient)' opacity='0.18'/>
        <defs>
            <linearGradient id='subjectAreaGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stop-color='var(--primary-color)' stop-opacity='0.5'/>
                <stop offset='100%' stop-color='var(--primary-color)' stop-opacity='0.1'/>
            </linearGradient>
        </defs>
        <path d='${path}' fill='none' stroke='var(--primary-color)' stroke-width='4' />
        ${circles}
        ${labels}
    </svg>`;
}
// Exam editing support
let editingExamId = null;
function editExam(examId) {
    const exams = getExams();
    const exam = exams.find(e => e.id === examId);
    if (!exam) return;
    editingExamId = examId;
    // Always close analytics/stats modals before opening edit modal
    closeSubjectAnalyticsModal();
    if (document.getElementById('exam-stats-modal')) document.getElementById('exam-stats-modal').style.display = 'none';
    document.getElementById('exam-subject').value = exam.subject;
    document.getElementById('exam-title').value = exam.title;
    document.getElementById('exam-score').value = exam.score;
    document.getElementById('exam-max-score').value = exam.maxScore;
    document.getElementById('exam-weight').value = exam.weight;
    document.getElementById('exam-date').value = exam.date;
    document.getElementById('exam-notes').value = exam.notes;
    document.getElementById('exam-modal').style.display = 'block';
}
// Update saveExam to support editing
function saveExam() {
    const subject = document.getElementById('exam-subject').value.trim();
    const title = document.getElementById('exam-title').value.trim();
    const score = parseFloat(document.getElementById('exam-score').value);
    const maxScore = parseFloat(document.getElementById('exam-max-score').value);
    const weight = parseFloat(document.getElementById('exam-weight').value);
    const date = document.getElementById('exam-date').value;
    const notes = document.getElementById('exam-notes').value.trim();
    if (!subject || !title || isNaN(score) || isNaN(maxScore) || isNaN(weight) || !date) {
        alert('Please fill in all required fields');
        return;
    }
    if (score < 0 || score > maxScore) {
        alert('Score must be between 0 and ' + maxScore);
        return;
    }
    if (weight < 1 || weight > 100) {
        alert('Weight must be between 1 and 100');
        return;
    }
    let exams = getExams();
    if (editingExamId) {
        exams = exams.map(e => e.id === editingExamId ? {
            ...e,
            subject, title, score, maxScore, weight, date, notes,
            percentage: Math.round((score / maxScore) * 100),
        } : e);
        editingExamId = null;
    } else {
        const exam = {
            id: Date.now(),
            subject: subject,
            title: title,
            score: score,
            maxScore: maxScore,
            percentage: Math.round((score / maxScore) * 100),
            weight: weight,
            date: date,
            notes: notes,
            timestamp: new Date().toISOString()
        };
        exams.push(exam);
    }
    saveExams(exams);
    closeExamModal();
    loadExams();
    updateExamStats();
    closeSubjectAnalyticsModal(); // Refresh subject modal if open
}
