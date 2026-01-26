import { useEffect, useMemo, useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import Modal from './Modal';
import Button from '../ui/Button';
import './Modal.css';

const getLetterGrade = (percentage) => {
  if (percentage >= 80) return 'A';
  if (percentage >= 65) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 25) return 'D';
  return 'E';
};

const AddExamModal = ({ isOpen, onClose, onAddExam }) => {
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [score, setScore] = useState('');
  const [maxScore, setMaxScore] = useState('100');
  const [weight, setWeight] = useState('100');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  const percentage = useMemo(() => {
    const numericScore = parseFloat(score);
    const numericMax = parseFloat(maxScore);
    if (!Number.isFinite(numericScore) || !Number.isFinite(numericMax) || numericMax <= 0) {
      return null;
    }
    return (numericScore / numericMax) * 100;
  }, [score, maxScore]);

  const validate = () => {
    const nextErrors = {};
    const numericScore = parseFloat(score);
    const numericMax = parseFloat(maxScore);
    const numericWeight = parseFloat(weight);

    if (!subject.trim()) nextErrors.subject = 'Subject is required.';
    if (!title.trim()) nextErrors.title = 'Exam title is required.';
    if (!Number.isFinite(numericScore)) nextErrors.score = 'Enter a valid score.';
    if (!Number.isFinite(numericMax) || numericMax <= 0) nextErrors.maxScore = 'Max score must be greater than 0.';
    if (Number.isFinite(numericScore) && Number.isFinite(numericMax) && numericScore > numericMax) {
      nextErrors.score = 'Score cannot exceed the max score.';
    }
    if (!Number.isFinite(numericWeight) || numericWeight < 1 || numericWeight > 100) {
      nextErrors.weight = 'Weight must be between 1 and 100.';
    }
    if (!date) nextErrors.date = 'Date is required.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setSubject('');
    setTitle('');
    setScore('');
    setMaxScore('100');
    setWeight('100');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const numericScore = parseFloat(score);
    const numericMax = parseFloat(maxScore);
    const numericWeight = parseFloat(weight);

    onAddExam({
      subject: subject.trim(),
      title: title.trim(),
      score: numericScore,
      maxScore: numericMax,
      weight: numericWeight,
      date,
      notes: notes.trim(),
      percentage: ((parseFloat(score) / parseFloat(maxScore)) * 100).toFixed(1)
    });

    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="add-exam-modal">
      <h3><BookOpen size={24} /> Add Exam Result</h3>
      <p className="settings-desc">Capture your exam details in seconds with auto-calculated metrics.</p>
      
      <form onSubmit={handleSubmit} className="exam-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Mathematics"
              required
            />
            {errors.subject && <span className="form-error">{errors.subject}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="title">Exam Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Yearly Exam"
              required
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="score">Score</label>
            <input
              id="score"
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="85"
              min="0"
              step="0.1"
              required
            />
            {errors.score && <span className="form-error">{errors.score}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="maxScore">Out of</label>
            <input
              id="maxScore"
              type="number"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              placeholder="100"
              min="1"
              step="0.1"
              required
            />
            {errors.maxScore && <span className="form-error">{errors.maxScore}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="weight">Weight (%)</label>
            <input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="100"
              min="1"
              max="100"
              step="1"
              required
            />
            {errors.weight && <span className="form-error">{errors.weight}</span>}
            <div className="form-chip-row">
              {[10, 20, 30, 50, 100].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`form-chip ${parseFloat(weight) === value ? 'active' : ''}`}
                  onClick={() => setWeight(String(value))}
                >
                  {value}%
                </button>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            {errors.date && <span className="form-error">{errors.date}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes..."
            rows={3}
          />
        </div>

        {percentage !== null && (
          <div className="score-preview">
            <span>Percentage: <strong>{percentage.toFixed(1)}%</strong></span>
            <span className="score-grade">Grade {getLetterGrade(percentage)}</span>
          </div>
        )}

        <div className="form-actions">
          <Button variant="secondary" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" icon={Plus}>
            Add Exam
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddExamModal;
