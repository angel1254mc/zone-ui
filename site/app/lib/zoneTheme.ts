import type { ThemeRegistration } from 'shiki/core';

/** Code colours drawn from the kit palette, on black. */
export const zoneTheme: ThemeRegistration = {
  name: 'zone',
  type: 'dark',
  colors: {
    'editor.background': '#000000',
    'editor.foreground': '#e7e7e7',
  },
  settings: [
    { settings: { foreground: '#e7e7e7', background: '#000000' } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#5e5e5e' } },
    {
      scope: ['string', 'string.template', 'punctuation.definition.string', 'string.unquoted.argument.shell'],
      settings: { foreground: '#faad2b' },
    },
    {
      scope: ['entity.name.tag', 'support.class.component', 'punctuation.definition.tag'],
      settings: { foreground: '#93ba00' },
    },
    {
      scope: [
        'keyword',
        'storage',
        'storage.type',
        'storage.modifier',
        'keyword.control',
        'keyword.operator.new',
        'keyword.operator.expression',
      ],
      settings: { foreground: '#7ca39c' },
    },
    {
      scope: ['constant.numeric', 'constant.language', 'constant.character', 'support.constant'],
      settings: { foreground: '#4fb8ff' },
    },
    { scope: ['entity.other.attribute-name'], settings: { foreground: '#b0b0b0' } },
    {
      scope: ['entity.name.function', 'support.function', 'entity.name.command', 'support.function.builtin'],
      settings: { foreground: '#ffffff' },
    },
    { scope: ['keyword.operator', 'punctuation', 'meta.brace'], settings: { foreground: '#c8c8c8' } },
  ],
};
