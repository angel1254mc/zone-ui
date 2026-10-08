import { useState } from 'react';
import { ChoiceButton, FireIcon, GiftIcon, StarIcon } from '@angel1254mc/zone-ui';

const topics = [
  {
    value: 'combat',
    icon: <FireIcon />,
    label: 'Combat events',
    description: 'New challenges and limited-time bosses.',
  },
  { value: 'banners', icon: <StarIcon />, label: 'Agent banners', description: 'When a new signal search opens.' },
  { value: 'rewards', icon: <GiftIcon />, label: 'Login rewards', description: 'A reminder when a reward is waiting.' },
];

export default function WithDescriptions() {
  const [on, setOn] = useState<string[]>(['banners']);
  const toggle = (value: string) =>
    setOn((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 520 }}>
      {topics.map((topic) => (
        <ChoiceButton
          key={topic.value}
          badge={topic.icon}
          description={topic.description}
          selected={on.includes(topic.value)}
          onClick={() => toggle(topic.value)}
        >
          {topic.label}
        </ChoiceButton>
      ))}
    </div>
  );
}
