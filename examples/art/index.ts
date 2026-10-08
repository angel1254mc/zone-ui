/**
 * Real game art for stories, example pages and the demo, loaded by URL at runtime from the
 * committed manifest (art-manifest.json; static.nanoka.cc + Enka.Network, Zenless Zone Zero ©
 * HoYoverse). Image components render real art, a neutral skeleton while loading, or an empty
 * frame — never imitation art. The library (src/) never imports this folder.
 */
export {
  configureArt,
  preloadGameArt,
  loadGameArt,
  gameArtUrl,
  GameArtProvider,
  useGameArtState,
  useGameArt,
  pickBySeed,
  useAgent,
  useWEngine,
  useDriveDiscSet,
  useItem,
  useNamecard,
  AgentImage,
  WEngineImage,
  DriveDiscImage,
  ItemImage,
  NamecardImage,
  GameIcon,
  resetGameArtForTests,
} from './gameArt';
export type {
  ArtStatus,
  ArtSource,
  AgentCrop,
  Rank,
  ItemRarity,
  GameAgent,
  GameWEngine,
  GameDriveDiscSet,
  GameItem,
  GameNamecard,
  GameArtManifest,
  GameArtState,
  GameImageProps,
} from './gameArt';
export { ArtSlot } from './ArtSlot';
export type { ArtSlotProps, ArtSlotState } from './ArtSlot';
export { STORY_ITEMS } from './storyItems';
export type { StoryItem } from './storyItems';
export { hashSeed } from './rng';
export type { Seed } from './rng';
