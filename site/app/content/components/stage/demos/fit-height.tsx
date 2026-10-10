import { GraffitiLayer, Stage, Text } from '@angel1254mc/zone-ui';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

export default function FitHeight() {
  return (
    <div style={{ width: 400, maxWidth: '100%', height: 300 }}>
      <Stage fit="height">
        <GraffitiLayer />
        <Text role="title" style={{ position: 'absolute', left: u(80), top: u(80) }}>
          Left edge
        </Text>
        <Text role="title" style={{ position: 'absolute', left: '50%', top: '50%', translate: '-50% -50%' }}>
          Centre
        </Text>
        <Text role="title" style={{ position: 'absolute', right: u(80), bottom: u(80) }}>
          Right edge
        </Text>
      </Stage>
    </div>
  );
}
