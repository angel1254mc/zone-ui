import { useState } from 'react';
import { SoundToggle } from '@angel1254mc/zone-ui';

export default function PopoverVolume() {
  const [volume, setVolume] = useState(0.4);
  return (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <SoundToggle volumeControl="popover" volume={volume} onVolumeChange={setVolume} />
      <p style={{ margin: 0 }}>Volume {Math.round(volume * 100)}%</p>
    </div>
  );
}
