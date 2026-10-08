import { create } from 'storybook/theming/create';

/**
 * Storybook themes for the Zone reskin. One palette for the manager (sidebar, toolbar,
 * addon panel) and the docs pages, taken from src/styles/tokens.css:
 *   bg.base #000 · bg.app #0B0B0B · text #F1F1F1 / muted #8C8C8C · accent lime #93BA00
 *   pill ring #333 (bevel #454545) · surface.button #090909 · stat row #161616.
 * Storybook's theme cannot animate, so colorPrimary/Secondary are the lime trough of the accent
 * pulse; manager.css paints selected/active states with the live var(--zzz-accent) instead.
 */

/** Mona Sans 900 at font-stretch 110% is the UI face (see src/styles/fonts.css). */
export const ZZZ_FONT_UI = '"Inpin Hongmeng", "Mona Sans", "Geologica", "Epilogue", system-ui, sans-serif';
export const ZZZ_FONT_CODE = '"JetBrains Mono", "Cascadia Code", Consolas, "SFMono-Regular", monospace';

/** An original mark (no HoYoverse artwork): a dark pill holding a "ZONE" wordmark (accent Z)
 * built from flat polygons (an <img> cannot use the page's web fonts), sheared 10deg like the
 * kit's italics. 170 x 48 viewBox; rendered 85 x 24 in the sidebar header. */
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 48" width="170" height="48">
<rect x="3" y="3" width="164" height="42" rx="21" fill="#000"/>
<rect x="6.5" y="6.5" width="157" height="35" rx="17.5" fill="#090909" stroke="#333" stroke-width="5"/>
<path d="M8 22a17.5 17.5 0 0 1 17.5-17" fill="none" stroke="#454545" stroke-width="1.2"/>
<g transform="translate(38 12) skewX(-10)">
<path fill="#93BA00" d="M0 0h20v5L9 19h11v5H0v-5L11 5H0z"/>
<path fill="#F1F1F1" fill-rule="evenodd" d="M32 0h6a7 7 0 0 1 7 7v10a7 7 0 0 1-7 7h-6a7 7 0 0 1-7-7V7a7 7 0 0 1 7-7zm1 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3z"/>
<path fill="#F1F1F1" d="M50 0h6l8 13V0h6v24h-6l-8-13v13h-6z"/>
<path fill="#F1F1F1" d="M75 0h20v5H81v4.5h12v5H81V19h14v5H75z"/>
</g>
</svg>`;

export const ZZZ_LOGO = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(LOGO_SVG)}`;

const palette = {
  base: 'dark' as const,

  colorPrimary: '#93BA00',
  colorSecondary: '#93BA00',

  appBg: '#000000',
  appContentBg: '#0B0B0B',
  appPreviewBg: '#0B0B0B',
  appBorderColor: '#333333',
  // radius.card (14 design units) at the manager's 0.5 density
  appBorderRadius: 7,

  fontBase: ZZZ_FONT_UI,
  fontCode: ZZZ_FONT_CODE,

  textColor: '#F1F1F1',
  textInverseColor: '#000000',
  textMutedColor: '#8C8C8C',

  barTextColor: '#8C8C8C',
  barHoverColor: '#F1F1F1',
  barSelectedColor: '#93BA00',
  barBg: '#000000',

  buttonBg: '#090909',
  buttonBorder: '#333333',
  booleanBg: '#161616',
  booleanSelectedBg: '#363636',

  inputBg: '#090909',
  inputBorder: '#333333',
  inputTextColor: '#F1F1F1',
  // radius.pill: every game input is a capsule
  inputBorderRadius: 999,

  brandTitle: 'Zone',
  brandUrl: './',
  brandImage: ZZZ_LOGO,
  brandTarget: '_self',
};

/** Manager theme (addons.setConfig({ theme })). */
export const zzzManagerTheme = create(palette);

/** Docs theme (parameters.docs.theme): same palette, docs pages render on the app background. */
export const zzzDocsTheme = create({ ...palette, appContentBg: '#000000' });
