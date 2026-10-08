import { StatusGrid } from '@angel1254mc/zone-ui';

const questions = [
  { status: 'success', label: 'Q1' },
  { status: 'error', label: 'Q2' },
  { status: 'success', label: 'Q3' },
  { status: 'success', label: 'Q4' },
  { status: 'empty', label: 'Q5' },
] as const;

export default function StatusGridHero() {
  return (
    <StatusGrid
      size="lg"
      aria-label="Quiz results"
      items={[...questions]}
      statusLabels={{ success: 'Correct', error: 'Incorrect', empty: 'Pending' }}
    />
  );
}
