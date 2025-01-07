import { 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut, 
    onAuthStateChanged 
} from 'firebase/auth';
import { 
    collection, 
    addDoc, 
    query, 
    where, 
    orderBy, 
    getDocs 
} from 'firebase/firestore';
import { auth, db } from './firebase';

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
const loginButton = document.getElementById('login-button');
const logoutButton = document.getElementById('logout-button');
const authStatus = document.getElementById('auth-status');
const sessionHistory = document.getElementById('session-history');
const historyList = document.getElementById('history-list');

let currentUser = null;

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
                logSession(isWorkTime ? 'work' : 'rest', isWorkTime ? workDuration : breakDuration);
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

// Authentication functions
async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        currentUser = result.user;
        loadSessionHistory();
    } catch (error) {
        console.error('Login error:', error);
    }
}

async function logout() {
    try {
        await signOut(auth);
        currentUser = null;
        sessionHistory.classList.add('hidden');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Session logging functions
async function logSession(type, duration) {
    if (!currentUser) return;
    
    try {
        await addDoc(collection(db, 'sessions'), {
            userId: currentUser.uid,
            type: type,
            duration: duration,
            completedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error logging session:', error);
    }
}

async function loadSessionHistory() {
    if (!currentUser) return;
    
    try {
        const sessionsRef = collection(db, 'sessions');
        const q = query(
            sessionsRef,
            where('userId', '==', currentUser.uid),
            orderBy('completedAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        historyList.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const session = doc.data();
            const date = new Date(session.completedAt).toLocaleDateString();
            historyList.innerHTML += `
                <div class="history-item">
                    <span>${session.type} session</span>
                    <span>${session.duration / 60} minutes</span>
                    <span>${date}</span>
                </div>
            `;
        });
        
        sessionHistory.classList.remove('hidden');
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

// Auth state observer
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
        loginButton.classList.add('hidden');
        logoutButton.classList.remove('hidden');
        authStatus.textContent = `Hello, ${user.email}`;
        loadSessionHistory();
    } else {
        loginButton.classList.remove('hidden');
        logoutButton.classList.add('hidden');
        authStatus.textContent = '';
        sessionHistory.classList.add('hidden');
    }
});

// Event Listeners
startPauseButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
toggleButton.addEventListener('click', switchMode);
increaseTimeBtn.addEventListener('click', () => adjustTime(5));
decreaseTimeBtn.addEventListener('click', () => adjustTime(-5));
skipRestBtn.addEventListener('click', skipRest);
loginButton.addEventListener('click', loginWithGoogle);
logoutButton.addEventListener('click', logout);

// Initialize
resetTimer(); 