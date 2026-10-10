import {
  AgentsIcon,
  BatteryIcon,
  BottomBar,
  DennyIcon,
  GraffitiLayer,
  IconButton,
  MailIcon,
  NoticesIcon,
  OptionsIcon,
  PolychromeIcon,
  ResourceBar,
  Screen,
  SignalSearchIcon,
  Stage,
  StorageIcon,
  StoreIcon,
  TopBar,
} from '@angel1254mc/zone-ui';
import { AgentImage } from 'examples/art';

const DOCK = [
  { label: 'Mail', icon: <MailIcon /> },
  { label: 'Options', icon: <OptionsIcon /> },
  { label: 'Notices', icon: <NoticesIcon /> },
  { label: 'Storage', icon: <StorageIcon /> },
  { label: 'Agents', icon: <AgentsIcon /> },
  { label: 'Store', icon: <StoreIcon /> },
  { label: 'Signal Search', icon: <SignalSearchIcon /> },
];

export default function HomeScreen() {
  return (
    <Stage>
      <Screen
        uid="1000000001"
        background={
          <div style={{ position: 'absolute', inset: 0 }}>
            <GraffitiLayer />
            <AgentImage
              id="1191"
              crop="full"
              fit="contain"
              position="50% 100%"
              alt=""
              style={{ position: 'absolute', inset: '4% 22% 0 36%', width: 'auto', height: 'auto' }}
            />
          </div>
        }
        topBar={
          <TopBar
            background="translucent"
            right={
              <ResourceBar
                items={[
                  { label: 'Battery Charge', value: 20, max: 240, icon: <BatteryIcon />, onAdd: () => {} },
                  { label: 'Dennies', value: 75918, icon: <DennyIcon />, onAdd: () => {} },
                  { label: 'Polychrome', value: 193, icon: <PolychromeIcon />, onAdd: () => {} },
                ]}
              />
            }
          />
        }
        bottomBar={
          <BottomBar
            right={DOCK.map((item) => (
              <IconButton key={item.label} icon={item.icon} label={item.label} />
            ))}
          />
        }
      />
    </Stage>
  );
}
