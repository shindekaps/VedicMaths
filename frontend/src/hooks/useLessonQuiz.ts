import { useState, useEffect } from 'react';
import { getNextProblem, submitAnswer, type Problem } from '../api/practice';
import { generateMCQOptions, solveProblemLocally } from '../utils/mathUtils';

export const useLessonQuiz = (sutraID: string, lessonID: string, practiceSessionID: string | null) => {
  const [quizQuestions, setQuizQuestions] = useState<Problem[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [quizCorrectCount, setQuizCorrectCount] = useState(0);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizMcqOptions, setQuizMcqOptions] = useState<string[]>([]);
  const [quizCorrectAnswerVal, setQuizCorrectAnswerVal] = useState<string>('');
  const [quizTimeLeft, setQuizTimeLeft] = useState(30);

  // Initialize Quiz questions (on demand loading, starts with Q1)
  const initQuiz = async () => {
    try {
      setLoadingQuiz(true);
      const firstProb = await getNextProblem(sutraID, lessonID, 1);
      setQuizQuestions([firstProb]);
      setCurrentQuizIndex(0);
      setQuizCorrectCount(0);
    } catch (err) {
      console.error('Failed to initialize quiz:', err);
    } finally {
      setLoadingQuiz(false);
    }
  };

  useEffect(() => {
    initQuiz();
  }, [sutraID, lessonID]);

  // Load active quiz question details
  const loadQuizQuestion = (index: number) => {
    if (!quizQuestions[index]) return;
    const currentProb = quizQuestions[index];
    const qText = currentProb.questionText || (currentProb as any).question || '';
    const localAns = solveProblemLocally(qText).toString();
    setQuizCorrectAnswerVal(localAns);
    if (currentProb.options && currentProb.options.length > 0) {
      setQuizMcqOptions(currentProb.options);
    } else {
      setQuizMcqOptions(generateMCQOptions(localAns));
    }
    setQuizSelectedOption(null);
    setQuizSubmitted(false);
    setQuizTimeLeft(30);
  };

  useEffect(() => {
    if (quizQuestions.length > 0 && quizQuestions[currentQuizIndex]) {
      loadQuizQuestion(currentQuizIndex);
    }
  }, [quizQuestions, currentQuizIndex]);

  // Timeout handler
  const handleQuizTimeout = async () => {
    if (quizSubmitted || !practiceSessionID || !quizQuestions[currentQuizIndex]) return;
    try {
      await submitAnswer({
        sessionId: practiceSessionID,
        problemId: quizQuestions[currentQuizIndex].id,
        answer: 0,
        sutraId: sutraID,
      });
      setQuizSubmitted(true);
      setQuizSelectedOption(quizCorrectAnswerVal);
    } catch (err) {
      console.error('Quiz Timeout submit failed:', err);
      setQuizSubmitted(true);
      setQuizSelectedOption(quizCorrectAnswerVal);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (!quizSubmitted && quizTimeLeft > 0 && quizQuestions.length > 0) {
      const timer = setInterval(() => {
        setQuizTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (quizTimeLeft === 0 && !quizSubmitted && quizQuestions.length > 0) {
      handleQuizTimeout();
    }
  }, [quizTimeLeft, quizSubmitted, quizQuestions]);

  // Confirm Quiz Answer
  const handleQuizConfirm = async () => {
    if (quizSubmitted || !quizSelectedOption || !practiceSessionID || !quizQuestions[currentQuizIndex]) return;

    try {
      const trimmed = quizSelectedOption.trim();
      const numVal = Number(trimmed);
      const res = await submitAnswer({
        sessionId: practiceSessionID,
        problemId: quizQuestions[currentQuizIndex].id,
        answer: isNaN(numVal) ? trimmed : numVal,
        sutraId: sutraID,
      });

      setQuizSubmitted(true);

      if (res.correct) {
        setQuizCorrectCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Failed to submit quiz answer:', err);
    }
  };

  // Lazy load next question or complete quiz
  const handleQuizNext = async (onCompleteCallback: (correctCount: number) => void) => {
    const nextIndex = currentQuizIndex + 1;
    if (nextIndex < 20) {
      if (!quizQuestions[nextIndex]) {
        try {
          setLoadingQuiz(true);
          const diff = nextIndex < 16 ? 1 : (nextIndex < 18 ? 2 : 3);
          const nextProb = await getNextProblem(sutraID, lessonID, diff);
          setQuizQuestions((prev) => [...prev, nextProb]);
          setCurrentQuizIndex(nextIndex);
        } catch (err) {
          console.error('Failed to load next quiz question:', err);
        } finally {
          setLoadingQuiz(false);
        }
      } else {
        setCurrentQuizIndex(nextIndex);
      }
    } else {
      onCompleteCallback(quizCorrectCount);
    }
  };

  const handleRetryQuiz = () => {
    setQuizQuestions([]);
    setCurrentQuizIndex(0);
    setQuizSubmitted(false);
    setQuizSelectedOption(null);
    setQuizCorrectCount(0);
    setQuizMcqOptions([]);
    setQuizCorrectAnswerVal('');
    setQuizTimeLeft(30);
    initQuiz();
  };

  return {
    quizQuestions,
    currentQuizIndex,
    quizSubmitted,
    quizSelectedOption,
    setQuizSelectedOption,
    quizCorrectCount,
    loadingQuiz,
    quizMcqOptions,
    quizCorrectAnswerVal,
    quizTimeLeft,
    handleQuizConfirm,
    handleQuizNext,
    handleRetryQuiz,
  };
};
