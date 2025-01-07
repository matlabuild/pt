const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

let timeLeft;
let timerId = null;
let isWorkTime = true;
let workDuration = WORK_TIME;
let breakDuration = BREAK_TIME;

// DOM Elements
const timerDisplay = document.querySelector('.timer');
const startPauseButton = document.getElementById('start-pause');
const resetButton = document.getElementById('reset');
const statusText = document.getElementById('status-text');
const toggleButton = document.getElementById('toggle-mode');
const increaseTimeBtn = document.getElementById('increase-time');
const decreaseTimeBtn = document.getElementById('decrease-time');
const skipRestBtn = document.getElementById('skip-rest');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // Update title
    if (timerId === null) {
        if (timeLeft === workDuration || timeLeft === breakDuration) {
            document.title = 'Pomodoro Timer';
        } else {
            document.title = `Paused ${timerDisplay.textContent} - Pomodoro`;
        }
    } else {
        const mode = isWorkTime ? 'Work' : 'Rest';
        document.title = `${mode} ${timerDisplay.textContent} - Pomodoro`;
    }
}

function adjustTime(minutes) {
    if (!timerId) {
        if (isWorkTime) {
            workDuration = Math.max(5 * 60, workDuration + (minutes * 60));
            timeLeft = workDuration;
        } else {
            breakDuration = Math.max(5 * 60, breakDuration + (minutes * 60));
            timeLeft = breakDuration;
        }
        updateDisplay();
    }
}

function switchMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? workDuration : breakDuration;
    statusText.textContent = isWorkTime ? 'Time to focus!' : 'Time for a break!';
    timerDisplay.classList.toggle('rest-mode');
    toggleButton.textContent = isWorkTime ? 'Rest Mode' : 'Work Mode';
    skipRestBtn.classList.toggle('hidden', isWorkTime);
    updateDisplay();
}

function startTimer() {
    if (timerId === null) {
        if (timeLeft === undefined) {
            timeLeft = workDuration;
        }
        startPauseButton.textContent = 'Pause';
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                switchMode();
                startTimer();
            }
        }, 1000);
    } else {
        pauseTimer();
    }
}

function pauseTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
        startPauseButton.textContent = 'Start';
    }
}

function resetTimer() {
    pauseTimer();
    isWorkTime = true;
    workDuration = WORK_TIME;
    breakDuration = BREAK_TIME;
    timeLeft = workDuration;
    statusText.textContent = 'Time to focus!';
    timerDisplay.classList.remove('rest-mode');
    toggleButton.textContent = 'Rest Mode';
    startPauseButton.textContent = 'Start';
    skipRestBtn.classList.add('hidden');
    updateDisplay();
}

function skipRest() {
    if (!isWorkTime) {
        switchMode();
        startTimer();
    }
}

// Event Listeners
startPauseButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
toggleButton.addEventListener('click', switchMode);
increaseTimeBtn.addEventListener('click', () => adjustTime(5));
decreaseTimeBtn.addEventListener('click', () => adjustTime(-5));
skipRestBtn.addEventListener('click', skipRest);

// Initialize
resetTimer(); 