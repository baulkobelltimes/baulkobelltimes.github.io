import { useMemo, useState } from 'react';
import { BarChart3, Trash2, Pencil, TrendingUp, TrendingDown, Minus } from 'lucide-react';
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

const ViewStatsModal = ({ isOpen, onClose, exams = [], onDeleteExam, onEditExam }) => {
  const [activeSubject, setActiveSubject] = useState(null);
  const stats = useMemo(() => {
    if (exams.length === 0) {
      return {
        average: 0,
        highest: 0,
        lowest: 0,
        total: 0,
        weightedAverage: 0,
        lastScore: 0,
        trendDelta: 0,
        hasTrend: false
      };
    }

    const percentages = exams.map(e => (e.score / e.maxScore) * 100);
    const weights = exams.map(e => e.weight || 100);
    const average = percentages.reduce((a, b) => a + b, 0) / percentages.length;
    const weightedSum = percentages.reduce((sum, score, i) => sum + (score * weights[i]), 0);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const weightedAverage = totalWeight > 0 ? (weightedSum / totalWeight) : 0;
    const highest = Math.max(...percentages);
    const lowest = Math.min(...percentages);
    const sortedByDate = [...exams].sort((a, b) => new Date(b.date) - new Date(a.date));
    const lastScore = (sortedByDate[0].score / sortedByDate[0].maxScore) * 100;
    const hasTrend = sortedByDate.length > 1;
    const trendDelta = hasTrend
      ? lastScore - ((sortedByDate[1].score / sortedByDate[1].maxScore) * 100)
      : 0;

    return {
      average,
      weightedAverage,
      highest,
      lowest,
      total: exams.length,
      lastScore,
      trendDelta,
      hasTrend
    };
  }, [exams]);

  const getGradeColor = (percentage) => {
    if (percentage >= 80) return 'excellent';
    if (percentage >= 65) return 'good';
    if (percentage >= 50) return 'average';
    return 'needs-work';
  };

  const subjectStats = useMemo(() => {
    const subjectMap = {};
    exams.forEach(exam => {
      if (!subjectMap[exam.subject]) {
        subjectMap[exam.subject] = { sum: 0, weight: 0, count: 0, highest: 0 };
      }
      const percentage = (exam.score / exam.maxScore) * 100;
      const weight = exam.weight || 100;
      subjectMap[exam.subject].sum += percentage * weight;
      subjectMap[exam.subject].weight += weight;
      subjectMap[exam.subject].count += 1;
      subjectMap[exam.subject].highest = Math.max(subjectMap[exam.subject].highest, percentage);
    });
    return Object.entries(subjectMap).map(([subject, data]) => ({
      subject,
      average: data.weight > 0 ? (data.sum / data.weight) : 0,
      count: data.count,
      highest: data.highest
    }));
  }, [exams]);

  const subjectExams = useMemo(() => {
    if (!activeSubject) return [];
    return exams
      .filter((exam) => exam.subject === activeSubject)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [exams, activeSubject]);

  const subjectChart = useMemo(() => {
    if (subjectExams.length === 0) return null;
    const width = Math.max(320, subjectExams.length * 80);
    const height = 200;
    const padding = 16;
    const baseY = height - padding;
    const points = subjectExams.map((exam, index) => {
      const percentage = (exam.score / exam.maxScore) * 100;
      const x = subjectExams.length === 1
        ? width / 2
        : padding + (index / (subjectExams.length - 1)) * (width - padding * 2);
      const y = padding + (1 - percentage / 100) * (height - padding * 2);
      return { x, y, percentage };
    });
    const polyline = points.map(point => `${point.x},${point.y}`).join(' ');
    const areaPoints = `${padding},${baseY} ${polyline} ${width - padding},${baseY}`;
    return { width, height, points, polyline, areaPoints };
  }, [subjectExams]);

  const scoreBands = useMemo(() => {
    const bands = [
      { label: 'A (80-100)', min: 80, max: 100, count: 0 },
      { label: 'B (65-79)', min: 65, max: 79.99, count: 0 },
      { label: 'C (50-64)', min: 50, max: 64.99, count: 0 },
      { label: 'D (25-49)', min: 25, max: 49.99, count: 0 },
      { label: 'E (0-24)', min: 0, max: 24.99, count: 0 }
    ];
    exams.forEach((exam) => {
      const percentage = (exam.score / exam.maxScore) * 100;
      const band = bands.find(item => percentage >= item.min && percentage <= item.max);
      if (band) band.count += 1;
    });
    return bands.map((band) => ({
      ...band,
      percent: exams.length > 0 ? (band.count / exams.length) * 100 : 0
    }));
  }, [exams]);

  const formatDate = (value) => {
    if (!value) return 'No date';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'No date';
    return parsed.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const trendIcon = stats.hasTrend
    ? stats.trendDelta > 0
      ? TrendingUp
      : stats.trendDelta < 0
        ? TrendingDown
        : Minus
    : Minus;

  const TrendIcon = trendIcon;

  const trendLabel = stats.hasTrend
    ? `${stats.trendDelta >= 0 ? '+' : ''}${stats.trendDelta.toFixed(1)}%`
    : '—';

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="view-stats-modal">
      <h3><BarChart3 size={24} /> Exam Statistics</h3>
      <div className="stats-header">
        <p className="settings-desc">View your exam performance, trends, and subject insights.</p>
      </div>
      
      {exams.length === 0 ? (
        <div className="no-stats">
          <p>No exams recorded yet. Add your first exam to see statistics!</p>
        </div>
      ) : (
        <>
          <div className="stats-overview">
            <div className="stat-box">
              <div className="stat-value">{stats.average.toFixed(1)}%</div>
              <div className="stat-label">Average</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{stats.weightedAverage.toFixed(1)}%</div>
              <div className="stat-label">Weighted Avg</div>
            </div>
            <div className="stat-box">
              <div className="stat-value excellent">{stats.highest.toFixed(1)}%</div>
              <div className="stat-label">Highest</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{stats.lowest.toFixed(1)}%</div>
              <div className="stat-label">Lowest</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{stats.lastScore.toFixed(1)}%</div>
              <div className="stat-label">Latest Score</div>
            </div>
            <div className="stat-box">
              <div className={`stat-value ${stats.trendDelta > 0 ? 'trend-up' : stats.trendDelta < 0 ? 'trend-down' : 'trend-neutral'}`}>
                <span className="stat-trend">
                  {TrendIcon && <TrendIcon size={16} />}
                  {trendLabel}
                </span>
              </div>
              <div className="stat-label">Recent Trend</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Exams</div>
            </div>
          </div>

          <div className="subject-breakdown">
            <h4>Subject Breakdown</h4>
            <div className="subject-stats">
              {subjectStats.map(subject => (
                <div key={subject.subject} className="subject-stat">
                  <div>
                    <div className="subject-name">{subject.subject}</div>
                    <div className="subject-avg">
                      {subject.average.toFixed(1)}% • Best {subject.highest.toFixed(1)}% • {subject.count} exam{subject.count > 1 ? 's' : ''}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveSubject(subject.subject)}
                    className="subject-action-btn"
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="score-bands-section">
            <h4>Score Bands</h4>
            <div className="score-bands">
              {scoreBands.map((band) => (
                <div key={band.label} className="score-band-row">
                  <span className="score-band-label">{band.label}</span>
                  <div className="score-band-bar">
                    <div className="score-band-fill" style={{ width: `${band.percent}%` }} />
                  </div>
                  <span className="score-band-count">{band.count}</span>
                </div>
              ))}
            </div>
          </div>

        </>
      )}

      <div className="modal-actions">
        <Button variant="primary" onClick={onClose}>
          Done
        </Button>
      </div>

      <Modal
        isOpen={Boolean(activeSubject)}
        onClose={() => setActiveSubject(null)}
        className="subject-detail-modal"
      >
        <h3>{activeSubject} Performance</h3>
        <p className="settings-desc">Track how your results change across assessments.</p>
        {subjectExams.length === 0 ? (
          <div className="no-stats">
            <p>No exams found for this subject yet.</p>
          </div>
        ) : (
          <div className="subject-performance-chart">
            <div className="subject-performance-scroll" style={{ width: subjectChart.width }}>
              <svg
                className="subject-performance-line"
                width={subjectChart.width}
                height={subjectChart.height}
                viewBox={`0 0 ${subjectChart.width} ${subjectChart.height}`}
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="subjectAreaGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(var(--primary-rgb), 0.35)" />
                    <stop offset="100%" stopColor="rgba(var(--primary-rgb), 0.02)" />
                  </linearGradient>
                </defs>
                <polygon
                  points={subjectChart.areaPoints}
                  className="subject-performance-area"
                />
                <polyline
                  points={subjectChart.polyline}
                  className="subject-performance-polyline"
                />
                {subjectChart.points.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="5"
                    className="subject-performance-point"
                  >
                    <title>{`${point.percentage.toFixed(1)}%`}</title>
                  </circle>
                ))}
              </svg>
              <div className="subject-performance-labels">
                {subjectExams.map((exam) => (
                  <span key={exam.id} className="subject-performance-label">
                    {exam.date
                      ? new Date(exam.date).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })
                      : '—'}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="subject-exams-list">
          {subjectExams.map((exam) => {
            const percentage = (exam.score / exam.maxScore) * 100;
            return (
              <div key={exam.id} className="exam-row">
                <div className="exam-info">
                  <span className="exam-title-name">{exam.title || 'Untitled Exam'}</span>
                  <span className="exam-date">{formatDate(exam.date)}</span>
                  <span className="exam-weight">Weight: {exam.weight || 100}%</span>
                  {exam.notes && <span className="exam-notes">{exam.notes}</span>}
                </div>
                <div className="exam-result">
                  <span className={`exam-percentage ${getGradeColor(percentage)}`}>
                    {percentage.toFixed(1)}%
                  </span>
                  <span className="exam-grade">Grade {getLetterGrade(percentage)}</span>
                  <span className="exam-raw-score">
                    {exam.score}/{exam.maxScore}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Pencil}
                    onClick={() => onEditExam && onEditExam(exam)}
                    aria-label="Edit exam"
                    className="edit-exam-btn"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => onDeleteExam(exam.id)}
                    aria-label="Delete exam"
                    className="delete-exam-btn"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="modal-actions">
          <Button variant="primary" onClick={() => setActiveSubject(null)}>
            Done
          </Button>
        </div>
      </Modal>
    </Modal>
  );
};

export default ViewStatsModal;
