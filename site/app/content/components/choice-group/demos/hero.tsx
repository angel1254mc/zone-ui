import { ChoiceGroup } from '@angel1254mc/zone-ui';

export default function ChoiceGroupHero() {
  return (
    <div style={{ width: '100%', maxWidth: 760 }}>
      <ChoiceGroup
        label="Which street is Random Play on?"
        defaultValue="sixth"
        items={[
          { value: 'ballet', label: 'Ballet Twins Road' },
          { value: 'lumina', label: 'Lumina Square' },
          { value: 'sixth', label: 'Sixth Street' },
          { value: 'blazewood', label: 'Blazewood' },
        ]}
      />
    </div>
  );
}
