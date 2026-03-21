import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import ICAL from 'ical.js';
import './App.css';
import Schedule from './components/Schedule';
import Sidebar from './components/Sidebar';
import Notepad from './components/Schedule/Notepad';
import { SettingsModal, AddExamModal, EditExamModal, ViewStatsModal } from './components/Modal';
import { ThemeProvider } from './hooks/useTheme';
import useTime from './hooks/useTime';
import useLocalStorage from './hooks/useLocalStorage';
import { SCHOOL_NAME, DEFAULT_QUICK_LINKS, APP_STORAGE_VERSION } from './config/constants';
import { parseTimetable } from './utils/timetableParser';
import Privacy from './pages/Privacy';

const STORAGE_VERSION_KEY = 'bbt_storage_version';

if (typeof window !== 'undefined') {
  try {
    const storedVersion = window.localStorage.getItem(STORAGE_VERSION_KEY);
    if (storedVersion !== APP_STORAGE_VERSION) {
      window.localStorage.clear();
      window.localStorage.setItem(STORAGE_VERSION_KEY, APP_STORAGE_VERSION);
    }
  } catch (error) {
    console.error('Unable to access localStorage for version migration:', error);
  }
}

function AppContent() {
  const { currentDay, greeting, isSchoolDay, getCountdownInfo } = useTime();
  const appRef = useRef(null);
  const isExtensionMode = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.location.protocol.endsWith('extension:');
  }, []);
  
  // State
  const [selectedDay, setSelectedDay] = useLocalStorage(
    'selectedDay', 
    isSchoolDay ? currentDay : 'Monday'
  );
  const [userName, setUserName] = useLocalStorage('userName', '');
  const [timetableData, setTimetableData] = useLocalStorage('userTimetable', null);
  const [tiles, setTiles] = useLocalStorage('tiles', {
    quickLinks: true,
    quote: true,
    timer: false,
    examTracker: false,
    notepad: false
  });
  const [tileOrder, setTileOrder] = useLocalStorage('tileOrder', ['quickLinks', 'quote', 'timer', 'examTracker']);

  // In extension mode we always hide the quick links and quote tiles.
  // This ensures they never flash on first load before settings are applied.
  const effectiveTiles = useMemo(() => {
    if (!isExtensionMode) return tiles;
    return {
      ...tiles,
      quickLinks: false,
      quote: false
    };
  }, [isExtensionMode, tiles]);

  const effectiveTileOrder = useMemo(() => {
    if (!isExtensionMode) return tileOrder;
    return tileOrder.filter((tile) => tile !== 'quickLinks' && tile !== 'quote');
  }, [isExtensionMode, tileOrder]);

  const [showRoom, setShowRoom] = useLocalStorage('showRoom', true);
  const [showSubject, setShowSubject] = useLocalStorage('showSubject', true);
  const [quickLinks, setQuickLinks] = useLocalStorage('quickLinks', DEFAULT_QUICK_LINKS);
  const [exams, setExams] = useLocalStorage('exams', []);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addExamOpen, setAddExamOpen] = useState(false);
  const [editExamOpen, setEditExamOpen] = useState(false);
  const [examToEdit, setExamToEdit] = useState(null);
  const [viewStatsOpen, setViewStatsOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Track the last day to detect when the actual calendar day changes
  const [lastDay, setLastDay] = useState(currentDay);

  // Update selected day only when the actual calendar day changes (not when user manually selects)
  useEffect(() => {
    if (lastDay !== currentDay && isSchoolDay) {
      setSelectedDay(currentDay);
      setLastDay(currentDay);
    }
  }, [currentDay, isSchoolDay, lastDay, setSelectedDay]);

  useEffect(() => {
    const validTiles = ['quickLinks', 'quote', 'timer', 'examTracker'];
    const filtered = tileOrder.filter(tile => validTiles.includes(tile));
    if (filtered.length !== tileOrder.length) {
      setTileOrder(filtered);
    }
  }, [tileOrder, setTileOrder]);

  // Document title update
  const countdownTitle = useMemo(() => {
    const info = getCountdownInfo(currentDay, timetableData);
    if (!isSchoolDay || !info?.text?.includes('Next period in:')) return SCHOOL_NAME;
    const cleaned = info.text.replace('Next period in: ', '').trim();
    return cleaned || SCHOOL_NAME;
  }, [getCountdownInfo, currentDay, timetableData, isSchoolDay]);

  useEffect(() => {
    const baseTitle = `${SCHOOL_NAME} Bell Times`;
    document.title = countdownTitle === SCHOOL_NAME ? baseTitle : `${countdownTitle} - ${baseTitle}`;
  }, [countdownTitle]);

  const hasSidebar = useMemo(() => {
    return effectiveTiles.quickLinks || effectiveTiles.quote || effectiveTiles.timer || effectiveTiles.examTracker;
  }, [effectiveTiles]);

  // Notification animation
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
  }, []);

  const handleTimetableUpload = useCallback(async (file) => {
    try {
      const text = await file.text();
      const jcaldata = ICAL.parse(text)[2];
      const data = parseTimetable(jcaldata);
      setTimetableData(data);
      setSettingsOpen(false);
      showNotification('Timetable imported successfully!', 'success');
    } catch (error) {
      console.error('Error parsing timetable:', error);
      showNotification('Failed to import timetable. Please check the file format.', 'error');
    }
  }, [setTimetableData, showNotification]);

  const handleTimetableClear = useCallback(() => {
    setTimetableData(null);
    setSettingsOpen(false);
    showNotification('Timetable cleared', 'success');
  }, [setTimetableData, showNotification]);

  const handleCountdownPrefsUpdate = useCallback((key, value) => {
    if (key === 'showRoom') setShowRoom(value);
    if (key === 'showSubject') setShowSubject(value);
  }, [setShowRoom, setShowSubject]);

  const handleTileToggle = useCallback((tile) => {
    setTiles((prev) => ({ ...prev, [tile]: !prev[tile] }));
  }, [setTiles]);

  const handleNameClick = useCallback(() => {
    const newName = prompt('Enter your name:', userName);
    if (newName !== null) {
      setUserName(newName.trim());
    }
  }, [userName, setUserName]);

  const handleAddExam = useCallback((exam) => {
    const timestamp = new Date().toISOString();
    setExams(prev => [...prev, { ...exam, id: Date.now(), createdAt: timestamp, updatedAt: timestamp }]);
    setAddExamOpen(false);
    showNotification('Exam added successfully!', 'success');
  }, [setExams, showNotification]);

  const handleEditExamOpen = useCallback((exam) => {
    setExamToEdit(exam);
    setEditExamOpen(true);
  }, []);

  const handleEditExamClose = useCallback(() => {
    setEditExamOpen(false);
    setExamToEdit(null);
  }, []);

  const handleUpdateExam = useCallback((updatedExam) => {
    const timestamp = new Date().toISOString();
    setExams(prev => prev.map(exam => (
      exam.id === updatedExam.id ? { ...exam, ...updatedExam, updatedAt: timestamp } : exam
    )));
    setEditExamOpen(false);
    setExamToEdit(null);
    showNotification('Exam updated successfully!', 'success');
  }, [setExams, showNotification]);

  const handleDeleteExam = useCallback((examId) => {
    setExams(prev => prev.filter(e => e.id !== examId));
    showNotification('Exam deleted', 'success');
  }, [setExams, showNotification]);

  const handleUpdateQuickLinks = useCallback((newLinks) => {
    setQuickLinks(newLinks);
    showNotification('Quick links updated!', 'success');
  }, [setQuickLinks, showNotification]);

  const handleTileReorder = useCallback((newOrder) => {
    setTileOrder(newOrder);
  }, [setTileOrder]);

  return (
    <div className="app" ref={appRef}>
      {/* Notification Toast */}
      {notification && (
        <div className={`notification-toast ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      <main className="main-content">
        <h2 className="greeting">
          {greeting}
          {userName && (
            <span 
              className="greeting-name" 
              onClick={handleNameClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleNameClick()}
            >
              , {userName}
            </span>
          )}
        </h2>

        <div className={`layout ${hasSidebar ? 'with-sidebar' : ''}`}>
          <div className="schedule-stack">
            <Schedule
              selectedDay={selectedDay}
              onDayChange={setSelectedDay}
              timetableData={timetableData}
              onOpenSettings={() => setSettingsOpen(true)}
              showRoom={showRoom}
              showSubject={showSubject}
            />
            {tiles.notepad && <Notepad />}
          </div>

          <Sidebar
            showQuickLinks={effectiveTiles.quickLinks}
            showQuote={effectiveTiles.quote}
            showTimer={effectiveTiles.timer}
            showExamTracker={effectiveTiles.examTracker}
            quickLinks={quickLinks}
            tileOrder={effectiveTileOrder}
            onTileReorder={handleTileReorder}
            onAddExam={() => setAddExamOpen(true)}
            onViewStats={() => setViewStatsOpen(true)}
            onUpdateQuickLinks={handleUpdateQuickLinks}
            exams={exams}
          />
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <a href="mailto:hi@shaarav.xyz">
            Made with ♥ by Shaarav4795
          </a>
          <nav className="footer-nav">
            <a href="/privacy" onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/privacy');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}>
              Privacy Policy
            </a>
          </nav>
        </div>
      </footer>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onTimetableUpload={handleTimetableUpload}
        onTimetableClear={handleTimetableClear}
        tiles={tiles}
        onTileToggle={handleTileToggle}
        userName={userName}
        onNameUpdate={setUserName}
        showRoom={showRoom}
        showSubject={showSubject}
        onCountdownPrefsUpdate={handleCountdownPrefsUpdate}
        isExtension={isExtensionMode}
      />

      <AddExamModal
        isOpen={addExamOpen}
        onClose={() => setAddExamOpen(false)}
        onAddExam={handleAddExam}
      />

      <EditExamModal
        key={examToEdit?.id ?? 'no-exam-selected'}
        isOpen={editExamOpen}
        onClose={handleEditExamClose}
        exam={examToEdit}
        onUpdateExam={handleUpdateExam}
      />

      <ViewStatsModal
        isOpen={viewStatsOpen}
        onClose={() => setViewStatsOpen(false)}
        exams={exams}
        onDeleteExam={handleDeleteExam}
        onEditExam={handleEditExamOpen}
      />
    </div>
  );
}

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    // Ensure the path is synced with the actual URL
    // This handles cases where the path might update after component mount
    const updatePath = () => {
      setCurrentPath(window.location.pathname);
    };

    updatePath();
    window.addEventListener('popstate', updatePath);
    return () => window.removeEventListener('popstate', updatePath);
  }, []);

  const isPrivacyPage = currentPath === '/privacy';

  return (
    <ThemeProvider>
      {isPrivacyPage ? <Privacy /> : <AppContent />}
    </ThemeProvider>
  );
}

export default App;
