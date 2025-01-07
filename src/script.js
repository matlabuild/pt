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
import { auth, db, getConnectionStatus } from './firebase.js';

// Constants
const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

// State variables
let currentUser = null;
let timeLeft;
let timerId = null;
let isWorkTime = true;
let workDuration = WORK_TIME;
let breakDuration = BREAK_TIME;
let sessionStartTime = null;
let sessionElapsedInterval = null;
let isExtraTime = false;

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
const finishButton = document.getElementById('finish');
const currentSession = document.getElementById('current-session');
const sessionStartEl = document.getElementById('session-start');
const sessionElapsedEl = document.getElementById('session-elapsed');

// Authentication functions
async function loginWithGoogle() {
    console.log('loginWithGoogle function called');
    const provider = new GoogleAuthProvider();
    try {
        console.log('Starting Google login...');
        const result = await signInWithPopup(auth, provider);
        console.log('Login successful:', result.user);
        currentUser = result.user;
        loadSessionHistory();
    } catch (error) {
        console.error('Login error:', error.code, error.message);
        alert(`Login failed: ${error.message}`);
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

// Auth event listeners
loginButton.addEventListener('click', () => {
    console.log('Login button clicked');
    loginWithGoogle();
});

logoutButton.addEventListener('click', logout);

// Auth state observer
onAuthStateChanged(auth, async (user) => {
    console.log('Auth state changed:', user);
    currentUser = user;
    if (user) {
        loginButton.classList.add('hidden');
        logoutButton.classList.remove('hidden');
        authStatus.textContent = `Hello, ${user.email}`;
        
        // Show loading state immediately
        sessionHistory.classList.remove('hidden');
        historyList.innerHTML = '<div class="history-item">Loading sessions...</div>';
        
        // Load session history
        await loadSessionHistory();
    } else {
        loginButton.classList.remove('hidden');
        logoutButton.classList.add('hidden');
        authStatus.textContent = '';
        sessionHistory.classList.add('hidden');
    }
});

// Add this function if it's missing
async function loadSessionHistory() {
    console.log('Loading history...', currentUser?.uid);
    if (!currentUser) {
        console.log('No user logged in');
        return;
    }
    
    try {
        const sessionsRef = collection(db, 'sessions');
        const q = query(
            sessionsRef,
            where('userId', '==', currentUser.uid),
            orderBy('completedAt', 'desc')
        );
        
        console.log('Executing query...');
        const querySnapshot = await getDocs(q);
        console.log('Query complete', querySnapshot.size, 'results');
        
        historyList.innerHTML = '';
        
        if (querySnapshot.empty) {
            console.log('No sessions found');
            historyList.innerHTML = '<div class="history-item">No sessions yet</div>';
            return;
        }
        
        querySnapshot.forEach((doc) => {
            const session = doc.data();
            console.log('Session data:', session);
            const startTime = new Date(session.startTime).toLocaleTimeString();
            const endTime = new Date(session.endTime).toLocaleTimeString();
            const durationFormatted = formatElapsedTime(session.duration);
            
            historyList.innerHTML += `
                <div class="history-item">
                    <div>
                        <strong>${session.type === 'work-extended' ? 'Extended Work' : 'Work'} Session</strong>
                        <div>${startTime} - ${endTime}</div>
                    </div>
                    <span>${durationFormatted}</span>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading history:', error);
        historyList.innerHTML = `<div class="history-item">Error: ${error.message}</div>`;
    }
}

// Add these timer functions
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
    if (timerId === null) {
        if (!sessionStartTime) {
            sessionStartTime = Date.now();
            sessionStartEl.textContent = new Date(sessionStartTime).toLocaleTimeString();
            currentSession.classList.remove('hidden');
            
            sessionElapsedInterval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
                sessionElapsedEl.textContent = formatElapsedTime(elapsed);
            }, 1000);
        }
        
        startPauseButton.textContent = 'Pause';
        finishButton.classList.remove('hidden');
        
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0 && !isExtraTime) {
                isExtraTime = true;
                timerDisplay.classList.add('extra-time');
                timeLeft = 60;
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
    isExtraTime = false;
    timeLeft = workDuration;
    sessionStartTime = null;
    clearInterval(sessionElapsedInterval);
    currentSession.classList.add('hidden');
    finishButton.classList.add('hidden');
    timerDisplay.classList.remove('extra-time');
    statusText.textContent = 'Time to focus!';
    timerDisplay.classList.remove('rest-mode');
    toggleButton.textContent = 'Rest Mode';
    startPauseButton.textContent = 'Start';
    skipRestBtn.classList.add('hidden');
    updateDisplay();
}

// Initialize timer
timeLeft = workDuration;
updateDisplay();

// Add event listeners for timer controls
startPauseButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
toggleButton.addEventListener('click', () => {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? workDuration : breakDuration;
    statusText.textContent = isWorkTime ? 'Time to focus!' : 'Time for a break!';
    timerDisplay.classList.toggle('rest-mode');
    toggleButton.textContent = isWorkTime ? 'Rest Mode' : 'Work Mode';
    skipRestBtn.classList.toggle('hidden', isWorkTime);
    updateDisplay();
});

increaseTimeBtn.addEventListener('click', () => {
    const increment = 5 * 60;
    if (isWorkTime) {
        workDuration += increment;
    } else {
        breakDuration += increment;
    }
    timeLeft += increment;
    updateDisplay();
});

decreaseTimeBtn.addEventListener('click', () => {
    const decrement = 5 * 60;
    if (isWorkTime && workDuration > decrement) {
        workDuration -= decrement;
        timeLeft = Math.min(timeLeft, workDuration);
    } else if (!isWorkTime && breakDuration > decrement) {
        breakDuration -= decrement;
        timeLeft = Math.min(timeLeft, breakDuration);
    }
    updateDisplay();
});

function formatElapsedTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

async function finishSession() {
    if (!sessionStartTime) return;
    
    // Stop all timers immediately
    clearInterval(timerId);
    clearInterval(sessionElapsedInterval);
    timerId = null;
    sessionElapsedInterval = null;
    
    const endTime = Date.now();
    const duration = Math.floor((endTime - sessionStartTime) / 1000);
    
    if (currentUser && isWorkTime) {
        try {
            await addDoc(collection(db, 'sessions'), {
                userId: currentUser.uid,
                type: isExtraTime ? 'work-extended' : 'work',
                startTime: sessionStartTime,
                endTime: endTime,
                duration: duration,
                completedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error saving session:', error);
        }
    }
    
    // Reset everything
    isWorkTime = true;
    isExtraTime = false;
    timeLeft = workDuration;
    sessionStartTime = null;
    currentSession.classList.add('hidden');
    finishButton.classList.add('hidden');
    timerDisplay.classList.remove('extra-time');
    timerDisplay.classList.remove('rest-mode');
    statusText.textContent = 'Time to focus!';
    toggleButton.textContent = 'Rest Mode';
    startPauseButton.textContent = 'Start';
    skipRestBtn.classList.add('hidden');
    sessionElapsedEl.textContent = '0:00';
    
    updateDisplay();
    loadSessionHistory();
}

finishButton.addEventListener('click', finishSession); 