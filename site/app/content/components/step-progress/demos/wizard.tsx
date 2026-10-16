import { useState } from 'react';
import { Button, StepProgress } from '@angel1254mc/zone-ui';

const steps = [{ label: 'Account' }, { label: 'Profile' }, { label: 'Settings' }, { label: 'Done' }];

export default function Wizard() {
  const [step, setStep] = useState(0);
  return (
    <div style={{ display: 'grid', gap: 24, justifyItems: 'center', width: '100%', maxWidth: 560 }}>
      <StepProgress variant="capsules" style={{ width: '100%' }} label="Setup" steps={steps} current={step} />
      <StepProgress variant="text" stepName="Step" steps={steps.length} current={step} />
      <div style={{ display: 'flex', gap: 16 }}>
        <Button width="compact" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          Back
        </Button>
        <Button width="compact" disabled={step >= steps.length - 1} onClick={() => setStep((s) => s + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
