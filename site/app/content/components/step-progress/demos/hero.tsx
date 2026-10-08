import { StepProgress } from '@angel1254mc/zone-ui';

export default function StepProgressHero() {
  return (
    <StepProgress
      variant="capsules"
      style={{ width: '100%' }}
      label="Onboarding"
      steps={[
        { label: 'Account' },
        { label: 'Profile' },
        { label: 'Settings' },
        { label: 'Review' },
        { label: 'Done' },
      ]}
      current={2}
    />
  );
}
