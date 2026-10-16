import { useEffect, useState } from 'react';
import { VoicePill } from '@angel1254mc/zone-ui';

const CLIP_MS = 4000;
const TICK_MS = 50;

export default function WithPlayback() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // A timer stands in for the clip. With a real <audio> element, call play() and pause()
  // in onPlayingChange, and set progress to currentTime / duration on "timeupdate".
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setProgress((p) => {
        const next = Math.min(1, p + TICK_MS / CLIP_MS);
        if (next >= 1) setPlaying(false);
        return next;
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [playing]);

  return (
    <VoicePill
      name="Mira Kessler"
      playing={playing}
      progress={progress}
      onPlayingChange={(next) => {
        if (next && progress >= 1) setProgress(0);
        setPlaying(next);
      }}
    />
  );
}
