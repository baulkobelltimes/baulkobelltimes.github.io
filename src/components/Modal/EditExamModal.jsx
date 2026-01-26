import { useEffect, useMemo, useState } from 'react';
import { Save, Pencil } from 'lucide-react';
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

const EditExamModal = ({ isOpen, onClose, exam, onUpdateExam }) => {
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [score, setScore] = useState('');
  const [maxScore, setMaxScore] = useState('100');
  const [weight, setWeight] = useState('100');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (exam && isOpen) {
      setSubject(exam.subject || '');
      setTitle(exam.title || '');
      setScore(exam.score ?? '');
      setMaxScore(exam.maxScore ?? '100');
      setWeight(exam.weight ?? '100');
      setDate(exam.date || new Date().toISOString().split('T')[0]);
      setNotes(exam.notes || '');
      setErrors({});
    }
  }, [exam, isOpen]);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!exam || !validate()) return;

    const numericScore = parseFloat(score);
    const numericMax = parseFloat(maxScore);
    const numericWeight = parseFloat(weight);

    onUpdateExam({
      id: exam.id,
      subject: subject.trim(),
      title: title.trim(),
      score: numericScore,
      maxScore: numericMax,
      weight: numericWeight,
      date,
      notes: notes.trim(),
      percentage: ((numericScore / numericMax) * 100).toFixed(1)
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="edit-exam-modal">
      <h3><Pencil size={24} /> Edit Exam</h3>
      <p className="settings-desc">Update your exam details to keep stats accurate.</p>

      <form onSubmit={handleSubmit} className="exam-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="edit-subject">Subject</label>
            <input
              id="edit-subject"
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="e.g., Mathematics"
              required
            />
            {errors.subject && <span className="form-error">{errors.subject}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="edit-title">Exam Title</label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g., Yearly Exam"
              required
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="edit-score">Score</label>
            <input
              id="edit-score"
              type="number"
              value={score}
              onChange={(event) => setScore(event.target.value)}
              placeholder="85"
              min="0"
              step="0.1"
              required
            />
            {errors.score && <span className="form-error">{errors.score}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="edit-maxScore">Out of</label>
            <input
              id="edit-maxScore"
              type="number"
              value={maxScore}
              onChange={(event) => setMaxScore(event.target.value)}
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
            <label htmlFor="edit-weight">Weight (%)</label>
            <input
              id="edit-weight"
              type="number"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              placeholder="100"
              min="1"
              max="100"
              step="1"
              required
            />
            {errors.weight && <span className="form-error">{errors.weight}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="edit-date">Date</label>
            <input
              id="edit-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
            {errors.date && <span className="form-error">{errors.date}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="edit-notes">Notes</label>
          <textarea
            id="edit-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
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
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" icon={Save}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditExamModal;
