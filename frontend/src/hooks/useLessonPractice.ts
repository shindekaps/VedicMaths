import { useState, useEffect } from 'react';
import { startPracticeSession, getNextProblem, submitAnswer, type Problem } from '../api/practice';
import { generateMCQOptions, solveProblemLocally } from '../utils/mathUtils';

export const useLessonPractice = (sutraID: string, lessonID: string) => {
  const [practiceSessionID, setPracticeSessionID] = useState<string | null>(null);
  const [practiceProblem, setPracticeProblem] = useState<Problem | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isAnsCorrect, setIsAnsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [attemptedCount, setAttemptedCount] = useState(0);
  const [loadingProblem, setLoadingProblem] = useState(false);

  const [mcqOptions, setMcqOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [correctAnswerVal, setCorrectAnswerVal] = useState<string>('');
  const [explanationSteps, setExplanationSteps] = useState<string[]>([]);

  // Initialize Practice Session on mount
  useEffect(() => {
    const initPractice = async () => {
      try {
        setLoadingProblem(true);
        const { sessionID } = await startPracticeSession(sutraID);
        setPracticeSessionID(sessionID);
        // First question has difficulty = 1 (easy)
        const prob = await getNextProblem(sutraID, lessonID, 1);
        setPracticeProblem(prob);
        setAttemptedCount(0);
        setCorrectCount(0);
      } catch (err) {
        console.error('Failed to initialize practice:', err);
      } finally {
        setLoadingProblem(false);
      }
    };
    initPractice();
  }, [sutraID, lessonID]);

  // Generate MCQ options and reset timer when a problem is loaded
  useEffect(() => {
    if (practiceProblem) {
      const qText = practiceProblem.questionText || (practiceProblem as any).question || '';
      const localAns = solveProblemLocally(qText).toString();
      setCorrectAnswerVal(localAns);
      if (practiceProblem.options && practiceProblem.options.length > 0) {
        setMcqOptions(practiceProblem.options);
      } else {
        setMcqOptions(generateMCQOptions(localAns));
      }
      setSelectedOption(null);
      setExplanationSteps([]);
      setTimeLeft(30);
    }
  }, [practiceProblem]);

  // Option submission handler
  const handleOptionClick = async (option: string) => {
    if (submitted || !practiceSessionID || !practiceProblem) return;

    setSelectedOption(option);

    try {
      const trimmed = option.trim();
      const numVal = Number(trimmed);
      const res = await submitAnswer({
        sessionId: practiceSessionID,
        problemId: practiceProblem.id,
        answer: isNaN(numVal) ? trimmed : numVal,
        sutraId: sutraID,
      });

      setIsAnsCorrect(res.correct);
      setSubmitted(true);
      if (res.correctAnswer !== undefined) {
        setCorrectAnswerVal(res.correctAnswer.toString());
      }
      setExplanationSteps(res.solutionSteps || []);
      setAttemptedCount((prev) => prev + 1);

      if (res.correct) {
        setCorrectCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
    }
  };

  // Timeout handler
  const handleTimeout = async () => {
    if (submitted || !practiceSessionID || !practiceProblem) return;
    try {
      const res = await submitAnswer({
        sessionId: practiceSessionID,
        problemId: practiceProblem.id,
        answer: 0,
        sutraId: sutraID,
      });
      setIsAnsCorrect(false);
      setSubmitted(true);
      const correctAns = res.correctAnswer !== undefined ? res.correctAnswer.toString() : correctAnswerVal;
      setCorrectAnswerVal(correctAns);
      setExplanationSteps(res.solutionSteps || []);
      setAttemptedCount((prev) => prev + 1);
      setSelectedOption(correctAns);
    } catch (err) {
      console.error('Timeout submit failed:', err);
      setIsAnsCorrect(false);
      setSubmitted(true);
      setAttemptedCount((prev) => prev + 1);
      setSelectedOption(correctAnswerVal);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (!submitted && timeLeft > 0 && practiceProblem) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, submitted, practiceProblem]);

  // Load next question or finish practice
  const loadNextPracticeQuestion = async (onCompleteCallback: (cnt: number) => void) => {
    if (attemptedCount >= 6) {
      onCompleteCallback(correctCount);
      return;
    }

    try {
      setLoadingProblem(true);
      setSubmitted(false);
      setIsAnsCorrect(null);
      setSelectedOption(null);
      // Out of 6 questions: 4 easy (difficulty = 1), 1 difficult (difficulty = 2), 1 hard (difficulty = 3)
      const currentDifficulty = attemptedCount < 4 ? 1 : (attemptedCount === 4 ? 2 : 3);
      const prob = await getNextProblem(sutraID, lessonID, currentDifficulty);
      setPracticeProblem(prob);
      setTimeLeft(30);
    } catch (err) {
      console.error('Failed to load next question:', err);
    } finally {
      setLoadingProblem(false);
    }
  };

  return {
    practiceSessionID,
    practiceProblem,
    submitted,
    isAnsCorrect,
    correctCount,
    attemptedCount,
    loadingProblem,
    mcqOptions,
    selectedOption,
    timeLeft,
    correctAnswerVal,
    explanationSteps,
    handleOptionClick,
    loadNextPracticeQuestion,
  };
};
