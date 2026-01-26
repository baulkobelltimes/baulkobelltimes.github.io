import { useState, useRef, useCallback } from 'react';
import { 
  Calendar, 
  Palette, 
  LayoutGrid, 
  User, 
  RotateCcw, 
  Puzzle,
  Upload,
  Trash2
} from 'lucide-react';
import Modal from './Modal';
import Button from '../ui/Button';
import useTheme from '../../hooks/useTheme';
import './Modal.css';

const TABS = [
  { id: 'timetable', label: 'Timetable', icon: Calendar },
  { id: 'themes', label: 'Themes', icon: Palette },
  { id: 'tiles', label: 'Tiles', icon: LayoutGrid },
  { id: 'more', label: 'More', icon: User },
  { id: 'reset', label: 'Reset', icon: RotateCcw },
  { id: 'extension', label: 'Extension', icon: Puzzle },
];

const STATIC_THEMES = [
  { id: 'default', label: 'Default', color: '#6200ea' },
  { id: 'dark', label: 'Dark', color: '#bb86fc' },
  { id: 'light', label: 'Light', color: '#1976d2' },
  { id: 'purple', label: 'Purple', color: '#9c27b0' },
  { id: 'green', label: 'Green', color: '#2e7d32' },
  { id: 'ocean', label: 'Ocean', color: '#0277bd' },
  { id: 'sunset', label: 'Sunset', color: '#f57c00' },
  { id: 'minimal', label: 'Minimal', color: '#424242' },
  { id: 'retro', label: 'Retro', color: '#d32f2f' },
  { id: 'forest', label: 'Forest', color: '#004d40' },
  { id: 'candy', label: 'Candy', color: '#ec407a' },
  { id: 'coffee', label: 'Coffee', color: '#795548' },
  { id: 'mint', label: 'Mint', color: '#00bfa5' },
  { id: 'coral', label: 'Coral', color: '#ff7043' },
  { id: 'lavender', label: 'Lavender', color: '#7e57c2' },
];


const SettingsModal = ({ 
  isOpen, 
  onClose,
  onTimetableUpload,
  onTimetableClear,
  tiles,
  onTileToggle,
  userName,
  onNameUpdate,
  showRoom,
  showSubject,
  onCountdownPrefsUpdate
}) => {
  const [activeTab, setActiveTab] = useState('timetable');
  const [nameInput, setNameInput] = useState(userName || '');
  const fileInputRef = useRef(null);
  const { themeName, setTheme } = useTheme();

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onTimetableUpload(file);
    }
  };

  const handleNameUpdate = () => {
    if (nameInput.trim()) {
      onNameUpdate(nameInput.trim());
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'timetable':
        return (
          <div>
            <h3><Calendar size={24} /> Timetable</h3>
            <p className="settings-desc">Import or clear your school timetable.</p>
            <div className="upload-section">
              <input
                ref={fileInputRef}
                type="file"
                accept=".ics"
                className="file-input"
                onChange={handleFileSelect}
              />
              <div className="upload-btns">
                <Button 
                  variant="primary"
                  icon={Upload}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Import Timetable
                </Button>
                <Button 
                  variant="secondary"
                  icon={Trash2}
                  onClick={onTimetableClear}
                >
                  Clear Timetable
                </Button>
              </div>
            </div>
          </div>
        );

      case 'themes':
        return (
          <div>
            <h3><Palette size={24} /> Themes</h3>
            <p className="settings-desc">Choose a theme to personalise your experience.</p>
            <div className="theme-section">
              <h4>Themes</h4>
              <div className="theme-grid">
                {STATIC_THEMES.map(theme => (
                  <button
                    key={theme.id}
                    className={`theme-btn ${themeName === theme.id ? 'active' : ''}`}
                    onClick={() => setTheme(theme.id)}
                  >
                    <span 
                      className="theme-preview"
                      style={{ background: theme.color }}
                    />
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'tiles':
        return (
          <div>
            <h3><LayoutGrid size={24} /> Tiles</h3>
            <p className="settings-desc">Toggle and manage dashboard tiles.</p>
            <div className="tiles-options">
              <div className="tile-toggle">
                <label>
                  <input
                    type="checkbox"
                    checked={tiles.quickLinks}
                    onChange={() => onTileToggle('quickLinks')}
                  />
                  Quick Links
                </label>
              </div>
              <div className="tile-toggle">
                <label>
                  <input
                    type="checkbox"
                    checked={tiles.quote}
                    onChange={() => onTileToggle('quote')}
                  />
                  Quote of the Day
                </label>
              </div>
              <div className="tile-toggle">
                <label>
                  <input
                    type="checkbox"
                    checked={tiles.timer}
                    onChange={() => onTileToggle('timer')}
                  />
                  Study Timer
                </label>
              </div>
              <div className="tile-toggle">
                <label>
                  <input
                    type="checkbox"
                    checked={tiles.examTracker}
                    onChange={() => onTileToggle('examTracker')}
                  />
                  Exam Tracker
                </label>
              </div>
              <div className="tile-toggle">
                <label>
                  <input
                    type="checkbox"
                    checked={tiles.notepad}
                    onChange={() => onTileToggle('notepad')}
                  />
                  Notepad
                </label>
              </div>
            </div>
          </div>
        );

      case 'more':
        return (
          <div>
            <h3><User size={24} /> More</h3>
            <p className="settings-desc">Edit your name and countdown display.</p>
            
            <div className="name-settings">
              <h4>Your Name</h4>
              <div className="name-edit">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter your name"
                  onKeyDown={(e) => e.key === 'Enter' && handleNameUpdate()}
                />
                <Button variant="secondary" onClick={handleNameUpdate}>
                  Update
                </Button>
              </div>
            </div>

            <div className="countdown-settings">
              <h4>Countdown Display</h4>
              <div className="countdown-options">
                <label>
                  <input
                    type="checkbox"
                    checked={showRoom}
                    onChange={() => onCountdownPrefsUpdate('showRoom', !showRoom)}
                  />
                  Show Room Number
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={showSubject}
                    onChange={() => onCountdownPrefsUpdate('showSubject', !showSubject)}
                  />
                  Show Subject Name
                </label>
              </div>
            </div>
          </div>
        );

      case 'reset':
        return (
          <div>
            <h3><RotateCcw size={24} /> Reset</h3>
            <p className="settings-desc">
              Reset all settings to their default values. This will clear your name, 
              preferences, quick links, notes, and theme.
            </p>
            <div className="reset-section">
              <p className="reset-warning">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <Button variant="danger" onClick={handleReset}>
                Reset All Settings
              </Button>
            </div>
          </div>
        );

      case 'extension':
        return (
          <div>
            <h3><Puzzle size={24} /> Chrome Extension</h3>
            <p className="settings-desc">
              Get the Baulko Bell Times Chrome extension for quick access from your browser!
            </p>
            <div className="extension-info">
              <div className="extension-steps">
                <h5>Installation Instructions:</h5>
                <ol>
                  <li>
                    Open{' '}
                    <a 
                      href="https://drive.google.com/drive/folders/1aljeqUz_4ZmBM-dFm2YXBnHlQTfAyUDG" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="extension-link"
                    >
                      this Google Drive link
                    </a>
                  </li>
                  <li>Select All</li>
                  <li>Press the 'Download' button</li>
                  <li>Extract the downloaded ZIP file</li>
                  <li>Open <code>chrome://extensions</code> in your browser</li>
                  <li>Enable "Developer mode" using the toggle in the top-right</li>
                  <li>Click "Load unpacked" and select the extracted folder</li>
                  <li>Enjoy your new extension!</li>
                </ol>
              </div>
              <div className="extension-note">
                <p>
                  <strong>Note:</strong> The extension provides quick access to bell times 
                  directly from your Chrome toolbar.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="settings-modal">
      <nav className="settings-sidebar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`settings-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={20} />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
      <div className="settings-content">
        <div className="settings-content-inner">
          {renderTabContent()}
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
