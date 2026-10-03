/** Small manifest fixture for examples/art tests (keys follow art-manifest.json). */
import type { GameArtManifest } from './gameArt'

export const artFixture: GameArtManifest = {
  schema: 2,
  source: 'https://static.nanoka.cc',
  version: '3.2',
  credits: 'Game data and art: static.nanoka.cc (community datamine) and Enka.Network (namecards). Zenless Zone Zero © HoYoverse.',
  sources: { nanoka: 'https://static.nanoka.cc/assets/zzz/', enka: 'https://enka.network/ui/zzz/' },
  agents: [
    {
      id: '1011', name: 'Anby', code: 'Anby', rank: 'A', element: 'Electric', baseElement: 'Electric', specialty: 'Stun', faction: 1,
      images: { circle: 'IconRoleCircle01.webp', select: 'IconRoleSelect01.webp', crop: 'IconRoleCrop01.webp', general: 'IconRoleGeneral01.webp', full: 'IconRole01.webp' },
      fullSize: [1268, 1716], namecard: 'ImgCardRoleS0001.png',
    },
    {
      id: '1021', name: 'Nekomata', code: 'Nekomata', rank: 'S', element: 'Physical', baseElement: 'Physical', specialty: 'Attack', faction: 1,
      images: { circle: 'IconRoleCircle11.webp', select: null, crop: 'IconRoleCrop11.webp', general: null, full: 'IconRole11.webp' },
      fullSize: [932, 1480], namecard: null,
    },
  ],
  wEngines: [
    { id: '14001', name: 'Cannon Rotor', rank: 'A', specialty: 'Attack', baseAtk: 594, advancedStat: 'ATK', description: '', image: 'Weapon_A_1001.webp' },
    { id: '14158', name: 'Ode of Resurrected Wings', rank: 'S', specialty: 'Anomaly', baseAtk: 743, advancedStat: 'ATK', description: '', image: 'Weapon_S_1581.webp', size: [156, 156] },
  ],
  driveDiscSets: [
    { id: '31000', name: 'Woodpecker Electro', twoPiece: 'CRIT Rate +8%', fourPiece: '', image: 'SuitWoodpeckerElectro.webp' },
  ],
  items: [
    { id: '10', name: 'Denny', rarity: 'b', category: 'currency', class: 1, iconName: 'IconCoin', image: 'IconCoin.webp', size: [156, 156] },
    { id: '100', name: 'Polychrome', rarity: 's', category: 'currency', class: 1, iconName: 'IconCurrency', image: 'IconCurrency.webp', size: [256, 256] },
    { id: '110001', name: 'Ferocious Grip', rarity: 's', category: 'material', class: 10, iconName: 'ExBigBoss001', image: null, sprite: { sheet: 'ExBigBoss001.webp', cell: 156, cols: 13 } },
  ],
  namecards: [
    { id: 'ImgCardRoleS0001', group: 'role', agentId: '1011', name: 'Anby', image: 'ImgCardRoleS0001.png', size: [4096, 404] },
    { id: 'ImgCardEvent05', group: 'event', image: 'ImgCardEvent05.png', size: [4096, 402] },
  ],
  icons: {
    elements: { Electric: 'IconElectric.webp', Lumiflux: null },
    specialties: { Stun: 'IconStun.webp' },
    misc: { coin: 'IconCoin.webp' },
  },
}
