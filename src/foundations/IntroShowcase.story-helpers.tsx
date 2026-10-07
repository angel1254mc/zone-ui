// Storybook-only: the bird's-eye showcase at the top of the Introduction page. Not exported from the package.
import { useState } from 'react';
import { BarChart } from '../components/BarChart';
import { Button } from '../components/Button';
import { ChipGroup } from '../components/Chip';
import { ChoiceGroup } from '../components/ChoiceButton';
import type { ChoiceResult } from '../components/ChoiceButton';
import { ContentCard } from '../components/ContentCard';
import { CountdownBar } from '../components/CountdownBar';
import { ConfirmDialog } from '../components/DialogBand';
import { FilterDrawer } from '../components/Drawer';
import { Modal } from '../components/Modal';
import { HatchBackground } from '../components/Backgrounds';
import { IconButton } from '../components/IconButton';
import { SegmentedTabs } from '../components/SegmentedTabs';
import { StatTile, StatTiles } from '../components/StatTiles';
import { StatusGrid } from '../components/StatusGrid';
import { StepProgress } from '../components/StepProgress';
import { Switch } from '../components/Switch';
import { ZzzTheme } from '../components/ZzzTheme';
import { CheckIcon, FilterIcon, StarIcon } from '../icons';
import './introShowcase.css';

const CHOICES = [
  { value: 'lime', label: 'Lime ↔ yellow' },
  { value: 'teal', label: 'Teal ↔ cyan' },
  { value: 'magenta', label: 'Magenta ↔ pink' },
  { value: 'orange', label: 'Orange ↔ red' },
];
const ANSWER = 'lime';

const CATEGORY_OPTIONS = [
  { value: 'agents', label: 'Agents' },
  { value: 'lore', label: 'Lore' },
  { value: 'gear', label: 'Gear' },
  { value: 'music', label: 'Music', disabled: true },
];
const DEFAULT_CATEGORIES = ['agents', 'lore'];
const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'normal', label: 'Normal' },
  { value: 'hard', label: 'Hard' },
];

const DISTRIBUTION = [
  { label: '0', value: 4 },
  { label: '1', value: 9 },
  { label: '2', value: 17 },
  { label: '3', value: 28 },
  { label: '4', value: 26 },
  { label: '5', value: 16 },
];

export function IntroShowcase() {
  const [picked, setPicked] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [round, setRound] = useState(0);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [difficulty, setDifficulty] = useState<string[]>(['normal']);
  const [quitOpen, setQuitOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results: Record<string, ChoiceResult> | undefined = revealed
    ? {
        [ANSWER]: 'correct',
        ...(picked && picked !== ANSWER ? { [picked]: 'incorrect' } : {}),
      }
    : undefined;

  const reset = () => {
    setPicked(null);
    setRevealed(false);
    setRound((r) => r + 1);
  };

  return (
    <ZzzTheme scale={0.6} className="zzz-intro-showcase">
      <HatchBackground />
      <div className="zzz-intro-showcase__grid">
        <section className="zzz-intro-showcase__col" aria-label="Controls">
          <p className="zzz-intro-showcase__label">Controls</p>
          <SegmentedTabs
            aria-label="Mode"
            items={[
              { value: 'daily', label: 'Daily' },
              { value: 'archive', label: 'Archive' },
              { value: 'stats', label: 'Stats' },
            ]}
            defaultValue="daily"
          />
          <div className="zzz-intro-showcase__row">
            <Button icon={<CheckIcon />} iconTone="confirm">
              Start
            </Button>
            <IconButton icon={<FilterIcon />} label="Filter" onClick={() => setFiltersOpen(true)} />
            <IconButton icon={<StarIcon />} label="Favourite" toggle defaultPressedState />
          </div>
          <ChipGroup
            label="Categories"
            options={CATEGORY_OPTIONS}
            value={categories}
            onValueChange={setCategories}
            multiple
            columns={2}
            size="sm"
          />
          <label className="zzz-intro-showcase__switch">
            <Switch defaultChecked aria-label="Sound" />
            <span>Sound</span>
          </label>
          <p className="zzz-intro-showcase__label">Overlays</p>
          <div className="zzz-intro-showcase__row">
            <Button size="sm" onClick={() => setQuitOpen(true)}>
              Dialog
            </Button>
            <Button size="sm" onClick={() => setHelpOpen(true)}>
              Modal
            </Button>
            <Button size="sm" icon={<FilterIcon />} iconTone="plain" onClick={() => setFiltersOpen(true)}>
              Drawer
            </Button>
          </div>
        </section>

        <section className="zzz-intro-showcase__col" aria-label="Question card">
          <p className="zzz-intro-showcase__label">Question card</p>
          <ContentCard
            eyebrow="Question 3 / 5"
            trailing={<StepProgress steps={5} current={2} variant="pips" size="sm" label="Progress" />}
            title="Which colour pair does this kit's accent pulse between?"
            footer={
              revealed ? (
                <Button onClick={reset}>Try again</Button>
              ) : (
                <Button
                  icon={<CheckIcon />}
                  iconTone="confirm"
                  disabled={picked === null}
                  onClick={() => setRevealed(true)}
                >
                  Confirm
                </Button>
              )
            }
          >
            <div className="zzz-intro-showcase__question">
              <CountdownBar
                key={round}
                durationMs={30_000}
                running={!revealed}
                onExpire={() => setRevealed(true)}
                label="Time left"
                size="sm"
              />
              <ChoiceGroup
                label="Answer"
                items={CHOICES}
                value={picked}
                onValueChange={setPicked}
                locked={revealed}
                results={results}
                size="sm"
              />
            </div>
          </ContentCard>
        </section>

        <section className="zzz-intro-showcase__col zzz-intro-showcase__col--wide" aria-label="Results">
          <p className="zzz-intro-showcase__label">Results</p>
          <div className="zzz-intro-showcase__results">
            <StatTiles columns={3} size="sm">
              <StatTile label="Played" value={12} />
              <StatTile label="Streak" value={4} delta="+1" />
              <StatTile label="Best" value="5/5" highlight />
            </StatTiles>
            <StatusGrid
              items={[
                { status: 'success', label: 'Q1' },
                { status: 'success', label: 'Q2' },
                { status: 'error', label: 'Q3' },
                { status: 'success', label: 'Q4' },
                { status: 'empty', label: 'Q5' },
              ]}
            />
            <BarChart
              data={DISTRIBUTION}
              highlight={3}
              markerLabel="You"
              height={150}
              xAxisLabel="Correct answers"
              label="Score distribution"
            />
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={quitOpen}
        onOpenChange={setQuitOpen}
        title="Quit today's run?"
        confirmLabel="Quit"
        cancelLabel="Keep playing"
        initialFocus="cancel"
        onConfirm={reset}
      >
        Your answers so far won't count, and the question restarts.
      </ConfirmDialog>

      <Modal
        open={helpOpen}
        onOpenChange={setHelpOpen}
        title="How to play"
        description="One short quiz a day, the same for everyone."
        footer={
          <Button icon={<CheckIcon />} iconTone="confirm" onClick={() => setHelpOpen(false)}>
            Got it
          </Button>
        }
      >
        <ul className="zzz-intro-showcase__list">
          <li>Five questions, 30 seconds each.</li>
          <li>Pick an answer, then confirm it.</li>
          <li>Share your result and come back tomorrow.</li>
        </ul>
      </Modal>

      <FilterDrawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        title="Filter questions"
        icon={<FilterIcon />}
        sort={{
          'aria-label': 'Sort by',
          options: [
            { value: 'newest', label: 'Newest' },
            { value: 'hardest', label: 'Hardest' },
          ],
          defaultValue: 'newest',
        }}
        groups={[
          {
            id: 'categories',
            label: 'Categories',
            options: CATEGORY_OPTIONS,
            value: categories,
            onValueChange: setCategories,
            multiple: true,
            columns: 2,
          },
          {
            id: 'difficulty',
            label: 'Difficulty',
            options: DIFFICULTY_OPTIONS,
            value: difficulty,
            onValueChange: setDifficulty,
            multiple: true,
            columns: 2,
          },
        ]}
        onReset={() => {
          setCategories(DEFAULT_CATEGORIES);
          setDifficulty(['normal']);
        }}
      />
    </ZzzTheme>
  );
}
