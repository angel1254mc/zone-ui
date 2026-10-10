import { ChoiceGroup, FireIcon, LockIcon, SnowflakeIcon, StarIcon } from '@angel1254mc/zone-ui';

export default function SettingsPicker() {
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <ChoiceGroup
        label="Difficulty"
        layout="list"
        defaultValue="normal"
        items={[
          {
            value: 'story',
            label: 'Story',
            badge: <StarIcon />,
            description: 'Enemies hit softer. Best if you are here for the plot.',
          },
          { value: 'normal', label: 'Normal', badge: <FireIcon />, description: 'The intended balance.' },
          {
            value: 'hard',
            label: 'Hard',
            badge: <SnowflakeIcon />,
            description: 'Tighter dodge windows, tougher elites.',
          },
          {
            value: 'nightmare',
            label: 'Nightmare',
            badge: <LockIcon />,
            description: 'Clear Hard once to unlock.',
            disabled: true,
          },
        ]}
      />
    </div>
  );
}
