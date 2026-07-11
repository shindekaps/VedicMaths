// Define types for steps based on backend/internal/domain/lesson.go
export interface IntroData {
  description: string;
  whatYouLearn: string[];
}

export interface Rule {
  icon: string;
  text: string;
}

export interface ConceptData {
  title: string;
  formula: string;
  formulaNote: string;
  rules: Rule[];
}

export interface Step {
  num: any;
  title: string;
  calc: string;
  isAnswer?: boolean;
}

export interface VisualData {
  title: string;
  problem: string;
  steps: Step[];
}

export interface QuizData {
  title: string;
  question: string;
  options: string[];
  answer: string;
}

export interface CompleteData {
  title: string;
  message: string;
  stars: number;
}

export interface Lesson {
  id: string;
  sutra_id: string;
  title: string;
  steps: {
    type: 'intro' | 'concept' | 'visual' | 'practice' | 'quiz' | 'complete';
    data: any;
  }[];
  order_index: number;
}
