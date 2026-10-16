import { useState } from 'react';
import { Button, CheckIcon, Drawer, OptionsIcon, Switch, Text } from '@angel1254mc/zone-ui';

const SETTINGS = [
  { id: 'sfx', label: 'Sound effects' },
  { id: 'music', label: 'Music' },
  { id: 'vibration', label: 'Vibration' },
];

export default function SettingsDrawer() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button icon={<OptionsIcon />} onClick={() => setOpen(true)}>
        Settings
      </Button>
      <Drawer
        title="Settings"
        icon={<OptionsIcon />}
        width={560}
        open={open}
        onOpenChange={setOpen}
        footer={
          <Button width="wide" icon={<CheckIcon />} iconTone="confirm" onClick={() => setOpen(false)}>
            Done
          </Button>
        }
      >
        <div style={{ display: 'grid', gap: 16 }}>
          {SETTINGS.map((s) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text as="label" role="bodyLg" htmlFor={s.id}>
                {s.label}
              </Text>
              <Switch id={s.id} defaultChecked />
            </div>
          ))}
        </div>
      </Drawer>
    </>
  );
}
