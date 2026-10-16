import { EventDescription } from '@angel1254mc/zone-ui';

export default function Wrapping() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 28,
        width: '100%',
        padding: 24,
        boxSizing: 'border-box',
        borderRadius: 16,
        background: 'linear-gradient(100deg, #e9f4f2, #f4d9e3 55%, #f6e7ec)',
      }}
    >
      {/* Line breaks in the string are kept. */}
      <EventDescription>{'Clear daily missions\nto fill the stamp card.'}</EventDescription>

      {/* Without breaks the text wraps inside maxWidth (in design units). */}
      <EventDescription maxWidth={420}>
        A longer description without manual breaks wraps inside its column and stays right-aligned.
      </EventDescription>
    </div>
  );
}
