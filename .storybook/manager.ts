// Must stay first: zone-ui modules need a global React when they evaluate (see the file).
import './addons/react-global'
import { addons } from 'storybook/manager-api'
// zone-ui foundations in the manager: the tokens (on :root; manager.css sets --zzz-scale: 0.5) and
// base.css, which runs the shared accent clock (@property --zzz-accent pulse, frozen by
// prefers-reduced-motion) that every selected / pressed state below reads.
import '../src/styles/tokens.css'
import '../src/styles/base.css'
import './manager.css'
import { zzzManagerTheme } from './zzzTheme'
import { registerZzzToolbar } from './addons/zzz-toolbar'
import { installTreeHighlight } from './addons/tree-highlight'

addons.setConfig({
  // brandTitle is the logo's alt text / tooltip: name the kit for what it is (ZZZ-inspired, not a recreation).
  theme: { ...zzzManagerTheme, brandTitle: 'Zone — a Zenless Zone Zero–inspired UI kit' },
  sidebar: { showRoots: true },
})

registerZzzToolbar()
installTreeHighlight()
