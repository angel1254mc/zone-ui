import { StepProgress } from '@angel1254mc/zone-ui';

const questions = [
  { label: 'Q1', status: 'success' as const },
  { label: 'Q2', status: 'error' as const },
  { label: 'Q3', status: 'success' as const },
  { label: 'Q4', status: 'skipped' as const },
  { label: 'Q5', status: 'current' as const },
];

export default function QuizResults() {
  return (
    <StepProgress
      variant="capsules"
      style={{ width: '100%' }}
      stepName="Question"
      label="Quiz progress"
      steps={questions}
      current={4}
      statusLabels={{ success: 'correct', error: 'incorrect' }}
    />
  );
}
