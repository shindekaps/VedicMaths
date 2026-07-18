import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { startPracticeSession, getNextProblem, submitAnswer, type Problem } from '../api/practice';
import { generateMCQOptions, solveProblemLocally } from '../utils/mathUtils';

export interface PracticeConfig {
  sutraId: string;
  lessonId: string; // "all" or specific lesson ID
  difficulty: string; // "1" (Easy), "2" (Medium), "3" (Hard), "dynamic"
  totalQuestions: number; // 5, 10, 15, 20
}

export const usePracticeSession = (setActive: (view: string) => void) => {
  const queryClient = useQueryClient();

  const [isActive, setIsActive] = useState(false);
  const [config, setConfig] = useState<PracticeConfig | null>(null);

  const [sessionID, setSessionID] = useState<string | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [mcqOptions, setMcqOptions] = useState<string[]>([]);
  const [correctAnswerVal, setCorrectAnswerVal] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isAnsCorrect, setIsAnsCorrect] = useState<boolean | null>(null);
  const [explanationSteps, setExplanationSteps] = useState<string[]>([]);
  const [loadingProblem, setLoadingProblem] = useState(false);

  // Progress and counters
  const [timeLeft, setTimeLeft] = useState(30);
  const [correctCount, setCorrectCount] = useState(0);
  const [attemptedCount, setAttemptedCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Start the practice session with config
  const startSession = async (sessionConfig: PracticeConfig) => {
    setConfig(sessionConfig);
    setIsActive(true);
    setAttemptedCount(0);
    setCorrectCount(0);
    setIsFinished(false);
    setSubmitted(false);
    setIsAnsCorrect(null);
    setSelectedOption(null);
    setExplanationSteps([]);

    try {
      setLoadingProblem(true);
      const { sessionID } = await startPracticeSession(sessionConfig.sutraId);
      setSessionID(sessionID);
      
      const difficultyParam = sessionConfig.difficulty === 'dynamic' ? undefined : Number(sessionConfig.difficulty);
      const lessonIdParam = sessionConfig.lessonId === 'all' ? undefined : sessionConfig.lessonId;
      
      const prob = await getNextProblem(sessionConfig.sutraId, lessonIdParam, difficultyParam);
      setProblem(prob);
    } catch (err) {
      console.error('Failed to initialize practice:', err);
    } finally {
      setLoadingProblem(false);
    }
  };

  // Generate options when problem changes
  useEffect(() => {
    if (problem) {
      const qText = problem.questionText || (problem as any).question || '';
      const localAns = solveProblemLocally(qText).toString();
      setCorrectAnswerVal(localAns);
      if (problem.options && problem.options.length > 0) {
        setMcqOptions(problem.options);
      } else {
        setMcqOptions(generateMCQOptions(localAns));
      }
      setSelectedOption(null);
      setExplanationSteps([]);
      setTimeLeft(30);
    }
  }, [problem]);

  // Handle countdown timeout
  const handleTimeout = async () => {
    if (submitted || !sessionID || !problem || !config) return;
    try {
      const res = await submitAnswer({
        sessionId: sessionID,
        problemId: problem.id,
        answer: 0,
        sutraId: config.sutraId,
      });
      setIsAnsCorrect(false);
      setSubmitted(true);
      setExplanationSteps(res.solutionSteps || []);
      setAttemptedCount((prev) => prev + 1);
      setSelectedOption(correctAnswerVal);
    } catch (err) {
      console.error('Timeout submit failed:', err);
      setIsAnsCorrect(false);
      setSubmitted(true);
      setAttemptedCount((prev) => prev + 1);
      setSelectedOption(correctAnswerVal);
    }
  };

  // Timer Countdown Effect
  useEffect(() => {
    if (isActive && !isFinished && !submitted && timeLeft > 0 && problem) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (isActive && timeLeft === 0 && !submitted && !isFinished && problem) {
      handleTimeout();
    }
  }, [isActive, timeLeft, submitted, isFinished, problem]);

  // Handle Option Click
  const handleOptionClick = async (option: string) => {
    if (submitted || !sessionID || !problem || !config) return;

    setSelectedOption(option);
    try {
      const trimmed = option.trim();
      const numVal = Number(trimmed);
      const res = await submitAnswer({
        sessionId: sessionID,
        problemId: problem.id,
        answer: isNaN(numVal) ? trimmed : numVal,
        sutraId: config.sutraId,
      });

      setIsAnsCorrect(res.correct);
      setSubmitted(true);
      setExplanationSteps(res.solutionSteps || []);
      setAttemptedCount((prev) => prev + 1);

      if (res.correct) {
        setCorrectCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
    }
  };

  // Load Next Question
  const loadNextQuestion = async () => {
    if (!config) return;
    if (attemptedCount >= config.totalQuestions) {
      setIsFinished(true);
      return;
    }

    try {
      setLoadingProblem(true);
      setSubmitted(false);
      setIsAnsCorrect(null);
      setSelectedOption(null);
      
      const difficultyParam = config.difficulty === 'dynamic' ? undefined : Number(config.difficulty);
      const lessonIdParam = config.lessonId === 'all' ? undefined : config.lessonId;
      
      const prob = await getNextProblem(config.sutraId, lessonIdParam, difficultyParam);
      setProblem(prob);
    } catch (err) {
      console.error('Failed to load next problem:', err);
    } finally {
      setLoadingProblem(false);
    }
  };

  // Finish Practice and Save XP
  const handleFinishPractice = async () => {
    if (!config) return;
    const xpEarned = correctCount * 15 + 50;
    const currentXP = parseInt(localStorage.getItem('accumulated_xp') || '0', 10);
    localStorage.setItem('accumulated_xp', (currentXP + xpEarned).toString());

    // Invalidate react query cache
    queryClient.invalidateQueries({ queryKey: ['userStats'] });
    queryClient.invalidateQueries({ queryKey: ['dailyStats'] });
    queryClient.invalidateQueries({ queryKey: ['progress'] });

    setIsActive(false);
    setConfig(null);
    setActive('dashboard');
  };

  return {
    isActive,
    config,
    problem,
    mcqOptions,
    correctAnswerVal,
    selectedOption,
    submitted,
    isAnsCorrect,
    explanationSteps,
    loadingProblem,
    timeLeft,
    correctCount,
    attemptedCount,
    isFinished,
    startSession,
    handleOptionClick,
    loadNextQuestion,
    handleFinishPractice,
  };
};
