import {
  BatteryIcon,
  BottomBar,
  Button,
  DennyIcon,
  FilterIcon,
  HomeIcon,
  IconButton,
  ItemCard,
  PolychromeIcon,
  RecycleIcon,
  ResourceBar,
  Screen,
  SectionTitleStrip,
  Stage,
  TopBar,
} from '@angel1254mc/zone-ui';
import { WEngineImage } from 'examples/art';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

export default function ScreenHero() {
  return (
    <Stage>
      <Screen
        background="mural"
        uid="1000000001"
        onBack={() => {}}
        topBar={
          <TopBar
            background="none"
            onBack={() => {}}
            left={
              <Button size="md" width="compact" icon={<HomeIcon />}>
                City
              </Button>
            }
            right={
              <ResourceBar
                items={[
                  { label: 'Battery Charge', value: 180, max: 240, icon: <BatteryIcon />, onAdd: () => {} },
                  { label: 'Dennies', value: 76418, icon: <DennyIcon />, onAdd: () => {} },
                  { label: 'Polychrome', value: 1600, icon: <PolychromeIcon />, onAdd: () => {} },
                ]}
              />
            }
          />
        }
        sectionStrip={<SectionTitleStrip title="W-Engine Storage" count={[113, 2000]} />}
        bottomBar={<BottomBar separator hints={[{ keyCap: 'T', label: 'Unlock' }]} />}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(6, ${u(118)})`,
            gap: u(17),
            padding: u(44) + ' ' + u(156),
          }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <ItemCard
              key={i}
              rarity={i % 3 ? 'a' : 's'}
              level={60}
              stars={1}
              selected={i === 0}
              art={<WEngineImage seed={i} alt="" />}
            />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: u(28), padding: `0 ${u(184)}` }}>
          <IconButton icon={<FilterIcon />} label="Filter" />
          <Button width="wide" icon={<RecycleIcon />} iconTone="recycle">
            Recycle
          </Button>
        </div>
      </Screen>
    </Stage>
  );
}
