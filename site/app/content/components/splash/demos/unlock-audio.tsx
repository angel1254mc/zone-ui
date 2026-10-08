import { useRef, useState } from 'react';
import { Button, Splash, Text } from '@angel1254mc/zone-ui';

export default function UnlockAudio() {
  const [open, setOpen] = useState(false);
  const [sound, setSound] = useState('Sound locked');
  const audio = useRef<AudioContext | null>(null);

  // Runs inside the click or key press that dismisses the splash, so the browser allows audio.
  const startAudio = () => {
    const ctx = (audio.current ??= new AudioContext());
    void ctx.resume();
    const tone = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    tone.connect(gain).connect(ctx.destination);
    tone.start();
    tone.stop(ctx.currentTime + 0.4);
    setSound('Sound on');
  };

  return (
    <div style={{ position: 'relative', height: 380, display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gap: 16, justifyItems: 'center' }}>
        <Text role="bodyLg" tone="secondary">
          {sound}
        </Text>
        <Button onClick={() => setOpen(true)}>Show splash</Button>
      </div>
      <Splash
        contained
        background="hatch"
        open={open}
        onOpenChange={setOpen}
        onEnter={startAudio}
        title="Hollow Beats"
        hint="Tap to start"
      />
    </div>
  );
}
