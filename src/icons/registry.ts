import type { IconComponent } from './types'
import {
  ArchiveReelIcon,
  BackIcon,
  CameraModeIcon,
  CaretDownIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  CloseIcon,
  CompareIcon,
  EnhanceIcon,
  ExclaimCircleIcon,
  FilterIcon,
  HangerIcon,
  HomeIcon,
  InfoAlertIcon,
  LockIcon,
  MinusIcon,
  PlusIcon,
  RecommendIcon,
  RecycleIcon,
  ResetIcon,
  ScrollArrowDownIcon,
  ScrollArrowUpIcon,
  SearchIcon,
  SortIcon,
  StarIcon,
  TrashIcon,
  UnlockIcon,
} from './actions'
import { ConsumablesCategoryIcon, DriveDiscCategoryIcon, MaterialsCategoryIcon, WEngineCategoryIcon } from './categories'
import {
  AchievementsIcon,
  AgentsIcon,
  CityFundIcon,
  InterKnotIcon,
  MailIcon,
  MoreIcon,
  NoticesIcon,
  OptionsIcon,
  SignalSearchIcon,
  SquadIcon,
  StorageIcon,
  StoreIcon,
} from './dock'
import { CompletedCheckIcon, GiftIcon, HourglassIcon, TargetLoopIcon } from './events'
import { AnomalyIcon, ArmorerIcon, AttackIcon, DefenseIcon, RuptureIcon, StunIcon, SupportIcon } from './specialty'
import { ElectricIcon, FireIcon, GoldDiamondIcon, HexStarIcon, SnowflakeIcon, StarSparkIcon, SwirlIcon } from './elements'
import {
  CombatSIcon,
  HexBadge,
  InfinityRankIcon,
  RankLetterA,
  RankLetterB,
  RankLetterS,
  RankStarburstIcon,
  SlotDigit1,
  SlotDigit2,
  SlotDigit3,
  SlotDigit4,
  SlotDigit5,
  SlotDigit6,
} from './rank'
import { BatteryIcon, CoinSmallIcon, DennyIcon, PolychromeIcon } from './currency'
import { DotGridOrnament, EmptySlotX, FilmSprocket, OverclockChevron, SignalBars } from './decorative'

/**
 * Every glyph by name. Keys are the export name without the `Icon` suffix, in
 * lower camelCase (`BackIcon` → `back`, `RankLetterS` → `rankLetterS`).
 * Grouped by family.
 */
export const icons = {
  // actions and navigation
  back: BackIcon,
  close: CloseIcon,
  home: HomeIcon,
  filter: FilterIcon,
  lock: LockIcon,
  unlock: UnlockIcon,
  trash: TrashIcon,
  star: StarIcon,
  plus: PlusIcon,
  minus: MinusIcon,
  check: CheckIcon,
  recycle: RecycleIcon,
  reset: ResetIcon,
  compare: CompareIcon,
  recommend: RecommendIcon,
  enhance: EnhanceIcon,
  infoAlert: InfoAlertIcon,
  clock: ClockIcon,
  exclaimCircle: ExclaimCircleIcon,
  search: SearchIcon,
  caretDown: CaretDownIcon,
  scrollArrowUp: ScrollArrowUpIcon,
  scrollArrowDown: ScrollArrowDownIcon,
  chevronLeft: ChevronLeftIcon,
  chevronRight: ChevronRightIcon,
  sort: SortIcon,
  hanger: HangerIcon,
  cameraMode: CameraModeIcon,
  archiveReel: ArchiveReelIcon,
  // storage categories
  wEngineCategory: WEngineCategoryIcon,
  driveDiscCategory: DriveDiscCategoryIcon,
  materialsCategory: MaterialsCategoryIcon,
  consumablesCategory: ConsumablesCategoryIcon,
  // home dock
  more: MoreIcon,
  squad: SquadIcon,
  mail: MailIcon,
  options: OptionsIcon,
  notices: NoticesIcon,
  achievements: AchievementsIcon,
  interKnot: InterKnotIcon,
  storage: StorageIcon,
  agents: AgentsIcon,
  store: StoreIcon,
  cityFund: CityFundIcon,
  signalSearch: SignalSearchIcon,
  // events
  gift: GiftIcon,
  targetLoop: TargetLoopIcon,
  hourglass: HourglassIcon,
  completedCheck: CompletedCheckIcon,
  // specialties
  attack: AttackIcon,
  rupture: RuptureIcon,
  stun: StunIcon,
  anomaly: AnomalyIcon,
  support: SupportIcon,
  defense: DefenseIcon,
  armorer: ArmorerIcon,
  // elements
  fire: FireIcon,
  starSpark: StarSparkIcon,
  snowflake: SnowflakeIcon,
  hexStar: HexStarIcon,
  goldDiamond: GoldDiamondIcon,
  swirl: SwirlIcon,
  electric: ElectricIcon,
  // rank, rarity and badges
  rankLetterS: RankLetterS,
  rankLetterA: RankLetterA,
  rankLetterB: RankLetterB,
  rankStarburst: RankStarburstIcon,
  infinityRank: InfinityRankIcon,
  combatS: CombatSIcon,
  slotDigit1: SlotDigit1,
  slotDigit2: SlotDigit2,
  slotDigit3: SlotDigit3,
  slotDigit4: SlotDigit4,
  slotDigit5: SlotDigit5,
  slotDigit6: SlotDigit6,
  hexBadge: HexBadge,
  // currency and resources
  battery: BatteryIcon,
  denny: DennyIcon,
  polychrome: PolychromeIcon,
  coinSmall: CoinSmallIcon,
  // decorative vectors
  emptySlotX: EmptySlotX,
  overclockChevron: OverclockChevron,
  signalBars: SignalBars,
  filmSprocket: FilmSprocket,
  dotGridOrnament: DotGridOrnament,
} satisfies Record<string, IconComponent>

/** Union of every registered icon name (`'back' | 'close' | …`). */
export type IconName = keyof typeof icons

/** All icon names, in registry order. */
export const iconNames = Object.keys(icons) as IconName[]
