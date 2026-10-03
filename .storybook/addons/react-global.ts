import React from 'react'

// Storybook's manager builder compiles JSX in classic mode (React.createElement) for every file,
// while zone-ui's sources use the automatic runtime and never import React; some (the icon set)
// even build elements at module load. Imported FIRST by manager.ts so the manager's React is a
// global before any zone-ui module evaluates.
;(globalThis as { React?: typeof React }).React ??= React
