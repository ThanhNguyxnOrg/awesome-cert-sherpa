import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import clsx from 'clsx';
import styles from './practice.module.css';

/** Fisher-Yates shuffle (unbiased). */
function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface SetSummary {
  setId: string;
  meta: { category: string; cert: string; vendor: string; version: number; description: string };
  questionCount: number;
  tags: string[];
}

interface Question {
  id: string;
  difficulty: string;
  tags: string[];
  question: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
  refs: string[];
  author: string;
}

interface QuestionSet {
  setId: string;
  meta: { category: string; cert: string; vendor: string; version: number; description: string };
  questions: Question[];
}

interface AttemptStats {
  attempts: number;
  bestScore: number;
  lastAttempt: string;
}

export default function PracticePage(): ReactNode {
  const [sets, setSets] = useState<SetSummary[]>([]);
  const [stats, setStats] = useState<Record<string, AttemptStats>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View state
  const [view, setView] = useState<'picker' | 'quiz' | 'results'>('picker');
  const [selectedSetSummary, setSelectedSetSummary] = useState<SetSummary | null>(null);
  
  // Quiz config state
  const [questionCount, setQuestionCount] = useState(10);
  
  // Active quiz state
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, { choice: number; correct: boolean }>>({});

  const indexUrl = useBaseUrl('/bank/index.json');
  const setsBaseUrl = useBaseUrl('/bank/sets/');

  // Fetch index
  useEffect(() => {
    let isMounted = true;
    const fetchIndex = async () => {
      try {
        const response = await fetch(indexUrl);
        if (!response.ok) throw new Error('Failed to load sets');
        const data = await response.json();
        if (isMounted) {
          setSets(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
          setLoading(false);
        }
      }
    };
    fetchIndex();
    return () => { isMounted = false; };
  }, [indexUrl]);

  // Load stats from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const newStats: Record<string, AttemptStats> = {};
      sets.forEach(set => {
        const key = `certsherpa_${set.setId}`;
        const item = localStorage.getItem(key);
        if (item) {
          newStats[set.setId] = JSON.parse(item);
        }
      });
      setStats(newStats);
    } catch (e) {
      console.warn('Failed to read from localStorage', e);
    }
  }, [sets]);

  const fetchSetAndStart = async () => {
    if (!selectedSetSummary) return;
    setLoading(true);
    try {
      const response = await fetch(`${setsBaseUrl}${selectedSetSummary.setId}.json`);
      if (!response.ok) throw new Error('Failed to load question set');
      const data: QuestionSet = await response.json();
      
      const shuffled = shuffle(data.questions);
      const selected = shuffled.slice(0, Math.min(questionCount, data.questions.length));
      
      setQuizQuestions(selected);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setSelectedChoice(null);
      setIsAnswerSubmitted(false);
      setView('quiz');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSetClick = (set: SetSummary) => {
    setSelectedSetSummary(set);
    setQuestionCount(Math.min(10, set.questionCount));
  };

  const submitAnswer = () => {
    if (selectedChoice === null) return;
    setIsAnswerSubmitted(true);
    const currentQ = quizQuestions[currentQuestionIndex];
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        choice: selectedChoice,
        correct: selectedChoice === currentQ.answerIndex
      }
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedChoice(null);
      setIsAnswerSubmitted(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const correctCount = Object.values(answers).filter(a => a.correct).length;
    const scorePercent = Math.round((correctCount / quizQuestions.length) * 100);

    if (selectedSetSummary && typeof window !== 'undefined') {
      try {
        const key = `certsherpa_${selectedSetSummary.setId}`;
        const current = stats[selectedSetSummary.setId] || { attempts: 0, bestScore: 0, lastAttempt: '' };
        const newStats = {
          attempts: current.attempts + 1,
          bestScore: Math.max(current.bestScore, scorePercent),
          lastAttempt: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(newStats));
        setStats(prev => ({ ...prev, [selectedSetSummary.setId]: newStats }));
      } catch (e) {
        console.warn('Failed to save stats', e);
      }
    }
    setView('results');
  };

  const renderPicker = () => {
    if (selectedSetSummary) {
      return (
        <div className={styles.quizContainer}>
          <div className="card">
            <div className="card__header">
              <Heading as="h2">{selectedSetSummary.meta.vendor} {selectedSetSummary.meta.cert}</Heading>
              <span className="badge badge--primary">{selectedSetSummary.meta.category}</span>
            </div>
            <div className="card__body">
              <p>{selectedSetSummary.meta.description}</p>
              <div className="margin-top--md">
                <label htmlFor="qCount" className={styles.inputLabel}>
                  Number of Questions (Max: {selectedSetSummary.questionCount})
                </label>
                <input
                  id="qCount"
                  type="number"
                  className={styles.numberInput}
                  min={1}
                  max={selectedSetSummary.questionCount}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Math.min(selectedSetSummary.questionCount, Math.max(1, parseInt(e.target.value) || 1)))}
                />
              </div>
            </div>
            <div className="card__footer">
              <div className="button-group button-group--block">
                <button className="button button--secondary" onClick={() => setSelectedSetSummary(null)}>
                  Cancel
                </button>
                <button className="button button--primary" onClick={fetchSetAndStart}>
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.grid}>
        {sets.map(set => {
          const stat = stats[set.setId];
          return (
            <div key={set.setId} className={styles.setCard} onClick={() => handleSetClick(set)}>
              <div className={styles.setCardHeader}>
                <span className="badge badge--secondary">{set.meta.vendor}</span>
                <span className="badge badge--info">{set.questionCount} Qs</span>
              </div>
              <h3 className={styles.setCardTitle}>{set.meta.cert}</h3>
              <div className={styles.setCardBody}>
                <small>{set.meta.description}</small>
              </div>
              <div className={styles.setCardFooter}>
                {stat ? (
                  <div className={styles.stats}>
                    <span title="Best Score">Best: {stat.bestScore}%</span>
                    <span title="Attempts">Attempts: {stat.attempts}</span>
                  </div>
                ) : (
                  <span>Not started</span>
                )}
                <span className="button button--sm button--link">Select &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderQuiz = () => {
    const currentQ = quizQuestions[currentQuestionIndex];
    if (!currentQ) return <div>Error: Question not found</div>;
    
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

    return (
      <div className={styles.quizContainer}>
        <div className={styles.progressContainer}>
          <div className={styles.progressLabel}>
            <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className={styles.questionCard}>
          <div className="badge badge--secondary margin-bottom--md">{currentQ.difficulty}</div>
          <p className={styles.questionText}>{currentQ.question}</p>
          
          <div className={styles.choicesGrid}>
            {currentQ.choices.map((choice, idx) => {
              let btnClass = styles.choiceBtn;
              if (isAnswerSubmitted) {
                if (idx === currentQ.answerIndex) btnClass = clsx(styles.choiceBtn, styles.choiceBtnCorrect);
                else if (idx === selectedChoice) btnClass = clsx(styles.choiceBtn, styles.choiceBtnIncorrect);
              } else if (idx === selectedChoice) {
                btnClass = clsx(styles.choiceBtn, styles.choiceBtnSelected);
              }

              return (
                <button
                  key={idx}
                  className={btnClass}
                  onClick={() => !isAnswerSubmitted && setSelectedChoice(idx)}
                  disabled={isAnswerSubmitted}
                >
                  {choice}
                </button>
              );
            })}
          </div>

          {isAnswerSubmitted && (
            <div className="margin-top--lg">
              <div className={styles.explanation}>
                <div className={styles.explanationTitle}>Explanation</div>
                <div className={styles.explanationText}>{currentQ.explanation}</div>
                {currentQ.refs && currentQ.refs.length > 0 && (
                  <div className={styles.references}>
                    <strong>References: </strong>
                    {currentQ.refs.map((ref, i) => (
                      <span key={i}>
                        <a href={ref} target="_blank" rel="noopener noreferrer">[{i + 1}]</a>
                        {i < currentQ.refs.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={styles.quizFooter}>
            {!isAnswerSubmitted ? (
              <button 
                className="button button--primary button--lg"
                disabled={selectedChoice === null}
                onClick={submitAnswer}
              >
                Submit Answer
              </button>
            ) : (
              <button 
                className="button button--primary button--lg"
                onClick={nextQuestion}
              >
                {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'View Results'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const correctCount = Object.values(answers).filter(a => a.correct).length;
    const scorePercent = Math.round((correctCount / quizQuestions.length) * 100);
    
    let colorClass = 'text--danger';
    let message = 'Keep practicing!';
    if (scorePercent >= 80) {
      colorClass = 'text--success';
      message = 'Excellent work!';
    } else if (scorePercent >= 60) {
      colorClass = 'text--warning';
      message = 'Good effort!';
    }

    return (
      <div className={styles.resultsContainer}>
        <div className={styles.scoreCard}>
          <div className={styles.scoreTitle}>Final Score</div>
          <div className={clsx(styles.scoreValue, colorClass)}>{scorePercent}%</div>
          <div className={styles.scoreMessage}>
            You scored {correctCount} out of {quizQuestions.length}. {message}
          </div>
        </div>

        <Heading as="h3">Review</Heading>
        <div className={styles.reviewList}>
          {quizQuestions.map((q, idx) => {
            const isCorrect = answers[q.id]?.correct;
            return (
              <div key={q.id} className={styles.reviewItem}>
                <div className={clsx(styles.reviewIcon, isCorrect ? styles.reviewIconCorrect : styles.reviewIconIncorrect)}>
                  {isCorrect ? '✓' : '✗'}
                </div>
                <div className={styles.reviewContent}>
                  <div className={styles.reviewQuestion}>{idx + 1}. {q.question.substring(0, 100)}...</div>
                  <div className={styles.reviewAnswer}>
                    Correct: {q.choices[q.answerIndex]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.actions}>
          <button className="button button--secondary button--lg" onClick={() => {
            setSelectedSetSummary(null);
            setView('picker');
          }}>
            Choose Another Set
          </button>
          <button className="button button--primary button--lg" onClick={fetchSetAndStart}>
            Restart Set
          </button>
        </div>
      </div>
    );
  };

  return (
    <Layout title="Practice" description="Interactive certification practice exams">
      <main className={styles.container}>
        <div className="text--center margin-bottom--lg">
          <Heading as="h1">Practice Lab</Heading>
          <p className="hero__subtitle">Test your knowledge with community-curated questions</p>
        </div>

        {loading && view === 'picker' && !selectedSetSummary && (
          <div className={styles.centerMessage}>
            <p>Loading practice sets...</p>
          </div>
        )}

        {loading && selectedSetSummary && view !== 'quiz' && (
          <div className={styles.centerMessage}>
            <p>Loading questions...</p>
          </div>
        )}

        {error && (
          <div className="alert alert--danger margin-bottom--lg" role="alert">
            {error}
            <button className="button button--link" onClick={() => setError(null)}>
              Dismiss
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {view === 'picker' && renderPicker()}
            {view === 'quiz' && renderQuiz()}
            {view === 'results' && renderResults()}
          </>
        )}
      </main>
    </Layout>
  );
}
