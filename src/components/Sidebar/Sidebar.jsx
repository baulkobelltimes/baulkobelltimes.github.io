import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { 
  Link, 
  RefreshCw, 
  Clock, 
  MessageSquare,
  BarChart3, 
  Plus, 
  TrendingUp, 
  Edit3,
  Check,
  X,
  GripVertical
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import useQuotes from '../../hooks/useQuotes';
import useTimer from '../../hooks/useTimer';
import useLocalStorage from '../../hooks/useLocalStorage';
import { DEFAULT_QUICK_LINKS } from '../../config/constants';
import { Modal } from '../Modal';
import './Sidebar.css';

// Quick Links Component
export const QuickLinks = ({ links = DEFAULT_QUICK_LINKS, onUpdateLinks }) => {
  const listRef = useRef(null);
  const [savedLinks] = useLocalStorage('quickLinks', DEFAULT_QUICK_LINKS);
  const displayLinks = links.length > 0 ? links : savedLinks;
  const [isEditing, setIsEditing] = useState(false);
  const [editableLinks, setEditableLinks] = useState(displayLinks);

  useEffect(() => {
    setEditableLinks(displayLinks);
  }, [displayLinks]);

  useEffect(() => {
    if (listRef.current) {
      const items = listRef.current.children;
      gsap.fromTo(items,
        { opacity: 0, x: -15 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.3,
          stagger: 0.05,
          ease: 'power2.out'
        }
      );
    }
  }, [displayLinks]);

  const ensureHttps = (url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
  };

  const handleSave = () => {
    const validLinks = editableLinks.filter(link => link.title.trim() && link.url.trim());
    if (onUpdateLinks) {
      onUpdateLinks(validLinks);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableLinks(displayLinks);
    setIsEditing(false);
  };

  const updateLink = (index, field, value) => {
    const newLinks = [...editableLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setEditableLinks(newLinks);
  };

  const addLink = () => {
    setEditableLinks([...editableLinks, { title: '', url: '' }]);
  };

  const removeLink = (index) => {
    setEditableLinks(editableLinks.filter((_, i) => i !== index));
  };

  return (
    <>
      <Card 
        className="quick-links-card" 
        title="Quick Links" 
        icon={Link}
        actions={
          <Button 
            variant="ghost" 
            icon={Edit3}
            onClick={() => setIsEditing(true)}
            aria-label="Edit links"
          />
        }
      >
        <div className="quick-links-list" ref={listRef}>
          {displayLinks.map((link, index) => (
            <a 
              key={index}
              href={ensureHttps(link.url)}
              className="quick-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.title}
            </a>
          ))}
        </div>
      </Card>

      <Modal isOpen={isEditing} onClose={handleCancel} className="quick-links-modal">
        <h3>Edit Quick Links</h3>
        <p className="settings-desc">Add, remove, or update your quick links.</p>
        <div className="quick-links-edit">
          {editableLinks.map((link, index) => (
            <div key={index} className="edit-link-row">
              <input
                type="text"
                placeholder="Title"
                value={link.title}
                onChange={(e) => updateLink(index, 'title', e.target.value)}
                className="edit-link-input"
              />
              <input
                type="text"
                placeholder="URL"
                value={link.url}
                onChange={(e) => updateLink(index, 'url', e.target.value)}
                className="edit-link-input"
              />
              <Button
                variant="ghost"
                icon={X}
                size="sm"
                onClick={() => removeLink(index)}
                aria-label="Remove link"
              />
            </div>
          ))}
          <Button
            variant="ghost"
            icon={Plus}
            size="sm"
            onClick={addLink}
            className="add-link-btn"
          >
            Add Link
          </Button>
          <div className="edit-actions">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" icon={Check} onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

// Quote of the Day Component with Typewriter Effect
export const QuoteOfDay = () => {
  const { quote, isLoading, refreshQuote } = useQuotes();
  const contentRef = useRef(null);
  const [displayedText, setDisplayedText] = useState('');
  const [displayedAuthor, setDisplayedAuthor] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Typewriter effect for quote text
  useEffect(() => {
    if (quote && !isLoading) {
      setIsTyping(true);
      setDisplayedText('');
      setDisplayedAuthor('');
      
      let textIndex = 0;
      const text = quote.text;
      const author = quote.author;
      
      // Type the quote text
      const textInterval = setInterval(() => {
        if (textIndex < text.length) {
          setDisplayedText(text.slice(0, textIndex + 1));
          textIndex++;
        } else {
          clearInterval(textInterval);
          
          // Then type the author
          let authorIndex = 0;
          const authorInterval = setInterval(() => {
            if (authorIndex < author.length) {
              setDisplayedAuthor(author.slice(0, authorIndex + 1));
              authorIndex++;
            } else {
              clearInterval(authorInterval);
              setIsTyping(false);
            }
          }, 30);
        }
      }, 20);

      return () => clearInterval(textInterval);
    }
  }, [quote, isLoading]);

  useEffect(() => {
    if (contentRef.current && quote) {
      gsap.fromTo(contentRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [quote]);

  const handleRefresh = () => {
    setDisplayedText('');
    setDisplayedAuthor('');
    refreshQuote();
  };

  return (
    <Card 
      className="quote-card" 
      title="Quote of the Day"
      icon={MessageSquare}
      actions={
        <Button 
          variant="ghost" 
          icon={RefreshCw}
          onClick={handleRefresh}
          aria-label="Refresh quote"
          className={isTyping ? 'spinning' : ''}
        />
      }
    >
      <div className={`quote-content ${isLoading ? 'loading' : ''}`} ref={contentRef}>
        {quote && (
          <>
            <p className="quote-text">
              {displayedText}
              {isTyping && displayedText.length < quote.text.length && (
                <span className="typewriter-cursor">|</span>
              )}
            </p>
            {displayedAuthor && (
              <p className="quote-author">{displayedAuthor}</p>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

// Study Timer Component with Custom Time
export const StudyTimer = () => {
  const { 
    mode, 
    formattedTime, 
    isRunning, 
    toggle, 
    stop, 
    switchMode,
    pomodoroDuration,
    breakDuration,
    setPomodoroDuration,
    setBreakDuration
  } = useTimer();
  
  const [showTimerSettings, setShowTimerSettings] = useState(false);
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const displayRef = useRef(null);

  useEffect(() => {
    if (displayRef.current) {
      gsap.to(displayRef.current, {
        scale: isRunning ? 1.02 : 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [isRunning]);

  const handleOpenTimerSettings = () => {
    setFocusMinutes(Math.max(1, Math.round(pomodoroDuration / 60)));
    setBreakMinutes(Math.max(1, Math.round(breakDuration / 60)));
    setShowTimerSettings(true);
  };

  const handleSaveTimerSettings = () => {
    const focusValue = Math.max(1, parseInt(focusMinutes, 10) || 1);
    const breakValue = Math.max(1, parseInt(breakMinutes, 10) || 1);
    setPomodoroDuration(focusValue * 60);
    setBreakDuration(breakValue * 60);
    setShowTimerSettings(false);
  };

  return (
    <>
      <Card
        className="timer-card"
        title="Study Timer"
        icon={Clock}
        actions={
          <Button
            variant="ghost"
            icon={Edit3}
            onClick={handleOpenTimerSettings}
            aria-label="Edit timer durations"
          />
        }
      >
        <div className="timer-display" ref={displayRef}>
          {formattedTime}
        </div>
        <div className="timer-controls">
          <Button
            variant={mode === 'pomodoro' ? 'primary' : 'secondary'}
            size="sm"
            className="timer-btn"
            onClick={() => switchMode('pomodoro')}
          >
            Focus
          </Button>
          <Button
            variant={mode === 'break' ? 'primary' : 'secondary'}
            size="sm"
            className="timer-btn"
            onClick={() => switchMode('break')}
          >
            Break
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="timer-btn"
            onClick={toggle}
          >
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="timer-btn stop-btn"
            onClick={stop}
          >
            Stop
          </Button>
        </div>
      </Card>

      <Modal isOpen={showTimerSettings} onClose={() => setShowTimerSettings(false)} className="timer-settings-modal">
        <h3>Edit Timer Durations</h3>
        <p className="settings-desc">Set focus and break durations that fit your study rhythm.</p>
        <div className="timer-settings-grid">
          <div className="timer-settings-card">
            <span className="timer-settings-label">Focus</span>
            <input
              type="number"
              value={focusMinutes}
              onChange={(e) => setFocusMinutes(e.target.value)}
              min="1"
              max="180"
              placeholder="25"
            />
            <span className="timer-settings-hint">minutes</span>
          </div>
          <div className="timer-settings-card">
            <span className="timer-settings-label">Break</span>
            <input
              type="number"
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(e.target.value)}
              min="1"
              max="60"
              placeholder="5"
            />
            <span className="timer-settings-hint">minutes</span>
          </div>
        </div>
        <div className="custom-time-actions">
          <Button variant="ghost" size="sm" onClick={() => setShowTimerSettings(false)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSaveTimerSettings}>
            Save
          </Button>
        </div>
      </Modal>
    </>
  );
};

// Exam Tracker Component
export const ExamTracker = ({ onAddExam, onViewStats, exams = [] }) => {
  const stats = useMemo(() => {
    if (exams.length === 0) {
      return { weightedAverage: null };
    }
    
    const scores = exams.map(e => (e.score / e.maxScore) * 100);
    const weights = exams.map(e => e.weight || 100);
    const weightedSum = scores.reduce((sum, score, i) => sum + (score * weights[i]), 0);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const weightedAverage = totalWeight > 0 ? (weightedSum / totalWeight) : 0;
    
    return {
      weightedAverage
    };
  }, [exams]);

  const formatPercent = (value) => (Number.isFinite(value) ? `${value.toFixed(1)}%` : '--');

  return (
    <Card className="exam-tracker-card" title="Exam Tracker" icon={BarChart3}>
      <div className="exam-highlight">
        <span className="exam-highlight-label">Weighted Average</span>
        <span className="exam-highlight-value">{formatPercent(stats.weightedAverage)}</span>
      </div>
      
      <div className="exam-controls">
        <Button 
          variant="primary" 
          size="sm"
          icon={Plus}
          onClick={onAddExam}
        >
          Add Exam
        </Button>
        <Button 
          variant="secondary" 
          size="sm"
          icon={TrendingUp}
          onClick={onViewStats}
        >
          View Insights
        </Button>
      </div>
    </Card>
  );
};

// Main Sidebar Component with Drag & Drop Reordering
const Sidebar = ({ 
  showQuickLinks = false,
  showQuote = false,
  showTimer = false,
  showExamTracker = false,
  quickLinks,
  tileOrder = ['quickLinks', 'quote', 'timer', 'examTracker'],
  onTileReorder,
  onAddExam,
  onViewStats,
  onUpdateQuickLinks,
  exams = []
}) => {
  const sidebarRef = useRef(null);
  const [draggedTile, setDraggedTile] = useState(null);
  const [dragOverTile, setDragOverTile] = useState(null);

  useEffect(() => {
    if (sidebarRef.current) {
      gsap.fromTo(sidebarRef.current.children,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.4,
          stagger: 0.1,
          ease: 'power2.out'
        }
      );
    }
  }, [showQuickLinks, showQuote, showTimer, showExamTracker]);

  const hasContent = showQuickLinks || showQuote || showTimer || showExamTracker;
  
  if (!hasContent) return null;

  const tileVisibility = {
    quickLinks: showQuickLinks,
    quote: showQuote,
    timer: showTimer,
    examTracker: showExamTracker
  };

  const tileComponents = {
    quickLinks: <QuickLinks links={quickLinks} onUpdateLinks={onUpdateQuickLinks} />,
    quote: <QuoteOfDay />,
    timer: <StudyTimer />,
    examTracker: <ExamTracker onAddExam={onAddExam} onViewStats={onViewStats} exams={exams} />
  };

  const handleDragStart = (e, tileId) => {
    setDraggedTile(tileId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, tileId) => {
    e.preventDefault();
    if (tileId !== draggedTile) {
      setDragOverTile(tileId);
    }
  };

  const handleDragLeave = () => {
    setDragOverTile(null);
  };

  const handleDrop = (e, targetTileId) => {
    e.preventDefault();
    if (draggedTile && draggedTile !== targetTileId && onTileReorder) {
      const newOrder = [...tileOrder];
      const draggedIndex = newOrder.indexOf(draggedTile);
      const targetIndex = newOrder.indexOf(targetTileId);
      
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedTile);
      
      onTileReorder(newOrder);
    }
    setDraggedTile(null);
    setDragOverTile(null);
  };

  const handleDragEnd = () => {
    setDraggedTile(null);
    setDragOverTile(null);
  };

  // Filter and order visible tiles
  const visibleTiles = tileOrder.filter(tileId => tileVisibility[tileId]);

  return (
    <aside className="sidebar" ref={sidebarRef}>
      {visibleTiles.map(tileId => (
        <div
          key={tileId}
          className={`sidebar-tile-wrapper ${draggedTile === tileId ? 'dragging' : ''} ${dragOverTile === tileId ? 'drag-over' : ''}`}
          draggable
          onDragStart={(e) => handleDragStart(e, tileId)}
          onDragOver={(e) => handleDragOver(e, tileId)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, tileId)}
          onDragEnd={handleDragEnd}
        >
          <div className="drag-handle" title="Drag to reorder">
            <GripVertical size={16} />
          </div>
          {tileComponents[tileId]}
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;
