// ==============================================
// SCHOOL CONFIGURATION
// ==============================================

// School Name - Used in various places including page title
const SCHOOL_NAME = "Baulko";

// School Links - Default quick links shown in the sidebar
const DEFAULT_QUICK_LINKS = [
    { title: 'Moodle', url: 'http://web1.baulkham-h.schools.nsw.edu.au' },
    { title: 'Sentral', url: 'https://baulkham-h.sentral.com.au' },
    { title: 'Classroom', url: 'https://classroom.google.com' }
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
    const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
    if (!onboardingComplete) {
        showWelcomeModal();
    } else {
        // Set the name in the settings input if it exists
        const userName = localStorage.getItem('userName');
        const nameInput = document.getElementById('name-input');
        if (nameInput && userName) {
            nameInput.value = userName;
        }
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
    { title: 'Classroom', url: 'https://classroom.google.com' }
];

function toggleQuickLinks() {
    const quickLinksToggle = document.getElementById('quick-links-toggle');
    const quickLinks = document.getElementById('quick-links');
    const schedule = document.querySelector('.schedule');
    
    localStorage.setItem('quickLinksEnabled', quickLinksToggle.checked);
    quickLinks.style.display = quickLinksToggle.checked ? 'block' : 'none';
    
    // Update the sidebar visibility based on both toggles
    const pomodoroEnabled = localStorage.getItem('pomodoroEnabled') === 'true';
    
    if (quickLinksToggle.checked || pomodoroEnabled) {
        schedule.classList.add('with-quick-links');
    } else {
        schedule.classList.remove('with-quick-links');
    }
}

function loadQuickLinks() {
    const quickLinksEnabled = localStorage.getItem('quickLinksEnabled') === 'true';
    const pomodoroEnabled = localStorage.getItem('pomodoroEnabled') === 'true';
    const quickLinksToggle = document.getElementById('quick-links-toggle');
    const pomodoroToggle = document.getElementById('pomodoro-toggle');
    const quickLinks = document.getElementById('quick-links');
    const pomodoro = document.getElementById('pomodoro');
    const schedule = document.querySelector('.schedule');
    const quickLinksList = document.querySelector('.quick-links-list');
    
    // Set the toggle states
    quickLinksToggle.checked = quickLinksEnabled;
    pomodoroToggle.checked = pomodoroEnabled;
    
    // Update displays
    quickLinks.style.display = quickLinksEnabled ? 'block' : 'none';
    pomodoro.style.display = pomodoroEnabled ? 'block' : 'none';
    
    if (quickLinksEnabled || pomodoroEnabled) {
        schedule.classList.add('with-quick-links');
    } else {
        schedule.classList.remove('with-quick-links');
    }
    
    // Load saved links or use defaults
    const savedLinks = JSON.parse(localStorage.getItem('quickLinks')) || DEFAULT_QUICK_LINKS;
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
    
    // Update the sidebar visibility based on both toggles
    const quickLinksEnabled = localStorage.getItem('quickLinksEnabled') === 'true';
    
    if (pomodoroToggle.checked || quickLinksEnabled) {
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

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', addPeriodStyles);

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
        // Clear name
        localStorage.removeItem('userName');
        
        // Clear countdown preferences
        localStorage.removeItem('showRoom');
        localStorage.removeItem('showSubject');
        
        // Clear quick links
        localStorage.removeItem('quickLinks');
        localStorage.removeItem('quickLinksEnabled');
        
        // Clear notes
        localStorage.removeItem('notes');
        localStorage.removeItem('notepadEnabled');
        
        // Clear theme
        localStorage.removeItem('theme');
        
        // Clear pomodoro settings
        localStorage.removeItem('pomodoroEnabled');
        
        // Clear onboarding flag
        localStorage.removeItem('onboardingComplete');

        // Clear timetable data
        localStorage.removeItem('userTimetable');
        userTimetable = null;
        
        // Reset UI elements
        document.getElementById('name-input').value = '';
        document.getElementById('show-room').checked = true;
        document.getElementById('show-subject').checked = true;
        document.getElementById('quick-links-toggle').checked = false;
        document.getElementById('notepad-toggle').checked = false;
        document.getElementById('pomodoro-toggle').checked = false;
        
        // Reset displays
        updateGreeting();
        loadQuickLinks();
        loadNotes();
        setTheme('default');
        updateSchedule(); // Update schedule display after clearing timetable
        
        // Close settings modal
        toggleSettingsModal();
        
        // Show success message
        alert('All settings have been reset successfully.');
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
        
        timerDisplay.removeChild(input);
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
