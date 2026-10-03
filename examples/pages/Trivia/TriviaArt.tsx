import type { CSSProperties, ReactNode } from 'react'
import {
  AnomalyIcon,
  ArmorerIcon,
  AttackIcon,
  DefenseIcon,
  ElectricIcon,
  FireIcon,
  GoldDiamondIcon,
  HexStarIcon,
  RuptureIcon,
  SnowflakeIcon,
  StarSparkIcon,
  StunIcon,
  SupportIcon,
  SwirlIcon,
} from '@angel1254mc/zone-ui'
import { AgentImage, DriveDiscImage, GameIcon, WEngineImage } from '../../art'
import type { TriviaArt as Art } from './questions'

const fill: CSSProperties = { width: '100%', height: '100%' }

/** Library SVG per element: GameIcon's `fallback`, shown only when the game icon is missing. */
export function elementFallback(element: string): ReactNode {
  switch (element) {
    case 'Fire':
      return <FireIcon style={{ ...fill, color: 'var(--zzz-color-element-fire-solid)' }} />
    case 'Ether':
      return <StarSparkIcon style={fill} />
    case 'Ice':
    case 'Frost':
      return <SnowflakeIcon style={{ ...fill, color: 'var(--zzz-color-element-snowflake)' }} />
    case 'Physical':
    case 'Honed Edge':
      return <GoldDiamondIcon style={{ ...fill, color: 'var(--zzz-color-element-gold-diamond)' }} />
    case 'Electric':
      return <ElectricIcon style={{ ...fill, color: 'var(--zzz-color-element-electric)' }} />
    case 'Wind':
      return <SwirlIcon style={{ ...fill, color: 'var(--zzz-color-element-swirl)' }} />
    default:
      return <HexStarIcon style={{ ...fill, color: 'var(--zzz-color-element-cyan-star)' }} />
  }
}

const SPECIALTY: Record<string, ReactNode> = {
  Attack: <AttackIcon style={fill} />,
  Stun: <StunIcon style={fill} />,
  Anomaly: <AnomalyIcon style={fill} />,
  Support: <SupportIcon style={fill} />,
  Defense: <DefenseIcon style={fill} />,
  Rupture: <RuptureIcon style={fill} />,
  Armorer: <ArmorerIcon style={fill} />,
}
export const specialtyFallback = (name: string) => SPECIALTY[name] ?? <AttackIcon style={fill} />

/**
 * Renders a question/option art descriptor (real id) with examples/art: real art, a neutral skeleton
 * while it loads, or an empty frame when it is missing. GameIcon uses the library-icon fallbacks above
 * only when the art is missing (never while loading), so nothing swaps in after load.
 */
export function TriviaArtView({ art, className }: { art: Art; className?: string }) {
  switch (art.kind) {
    case 'agent':
      return <AgentImage id={art.id} crop={art.crop ?? 'circle'} alt="" className={className} />
    case 'wengine':
      return <WEngineImage id={art.id} alt="" className={className} />
    case 'disc':
      return <DriveDiscImage id={art.id} alt="" className={className} />
    case 'element':
      return <GameIcon kind="elements" name={art.name} fallback={elementFallback(art.name)} className={className} style={fill} />
    case 'specialty':
      return <GameIcon kind="specialties" name={art.name} fallback={specialtyFallback(art.name)} className={className} style={fill} />
  }
}
