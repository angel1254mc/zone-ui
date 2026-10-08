import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ItemCard } from './ItemCard';
import { ItemGridItemContext } from './itemGridContext';

describe('ItemCard', () => {
  it('renders a button named from name, level, rarity, stars, lock and equipped-by', () => {
    render(
      <ItemCard name="The Brimstone" level={60} rarity="s" stars={1} locked equippedBy="Soldier 11" avatar="a.png" />
    );
    const btn = screen.getByRole('button', {
      name: 'The Brimstone, Level 60, Rank S, 1 of 5 stars, Locked, Equipped by Soldier 11',
    });
    expect(btn).toHaveAttribute('type', 'button');
    expect(btn).toHaveClass('zzz-item-card', 'zzz-item-card--storage', 'zzz-item-card--rarity-s');
    // the visual capsule shows the level but is hidden from AT (the name already says it)
    expect(screen.getByText('Lv. 60').closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('renders art, specialty, stars, lock and avatar slots', () => {
    const { container } = render(
      <ItemCard
        name="x"
        art={<svg data-testid="art" />}
        specialty={<svg data-testid="spec" />}
        stars={3}
        locked
        avatar={<span data-testid="av" />}
      />
    );
    expect(screen.getByTestId('art').parentElement).toHaveClass('zzz-item-card__art');
    expect(screen.getByTestId('spec').parentElement).toHaveClass('zzz-item-card__specialty');
    expect(screen.getByTestId('av').parentElement).toHaveClass('zzz-item-card__avatar');
    expect(container.querySelector('.zzz-item-card__lock')).not.toBeNull();
    expect(container.querySelectorAll('.zzz-star-rating__star[data-filled]')).toHaveLength(3);
  });

  it('renders an image avatar from a URL', () => {
    const { container } = render(<ItemCard avatar="agent.png" />);
    expect(container.querySelector('.zzz-item-card__avatar img')).toHaveAttribute('src', 'agent.png');
  });

  it('shows the slot hexagon instead of the specialty glyph on drive discs', () => {
    const { container } = render(<ItemCard name="Disc" slot={3} specialty={<svg data-testid="spec" />} />);
    expect(container.querySelector('.zzz-slot-hex')).not.toBeNull();
    expect(screen.queryByTestId('spec')).toBeNull();
    expect(screen.getByRole('button')).toHaveAccessibleName('Disc, Rank B, Slot 3');
  });

  it.each(['storage', 'list', 'material', 'slot', 'ingredient', 'reward', 'preview'] as const)(
    'size %s sets its modifier',
    (size) => {
      render(<ItemCard size={size} />);
      expect(screen.getByRole('button')).toHaveClass(`zzz-item-card--${size}`);
    }
  );

  it('renders a count, marking a short owned count as danger', () => {
    render(<ItemCard name="Battery" count={{ owned: 20, required: 60 }} size="ingredient" />);
    const owned = screen.getByText('20');
    expect(owned).toHaveAttribute('data-short');
    expect(owned.parentElement).toHaveTextContent('20/60');
    expect(screen.getByRole('button')).toHaveAccessibleName('Battery, 20 of 60 required, insufficient, Rank B');
  });

  it('does not mark a sufficient count', () => {
    render(<ItemCard count={{ owned: 320, required: 60 }} />);
    expect(screen.getByText('320')).not.toHaveAttribute('data-short');
  });

  it('renders a plain number count', () => {
    render(<ItemCard name="Chip" count={7} />);
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAccessibleName('Chip, Quantity 7, Rank B');
  });

  it('renders the EMPTY variant', () => {
    const { container } = render(<ItemCard empty level={60} stars={2} />);
    const btn = screen.getByRole('button', { name: 'Empty slot' });
    expect(btn).toHaveAttribute('data-empty');
    expect(screen.getByText('EMPTY')).toBeInTheDocument();
    expect(container.querySelector('.zzz-icon--emptySlotX')).not.toBeNull();
    expect(container.querySelector('.zzz-item-card__art')).toBeNull();
    expect(container.querySelector('.zzz-star-rating')).toBeNull();
  });

  it('sizes preview at the 95 token and the slot EMPTY capsule at 25', () => {
    const { rerender } = render(<ItemCard size="preview" />);
    const btn = screen.getByRole('button');
    expect(btn.style.getPropertyValue('--zzz-card-w')).toBe('95');
    expect(btn.style.getPropertyValue('--zzz-card-h')).toBe('95');
    rerender(<ItemCard size="slot" empty />);
    expect(btn.style.getPropertyValue('--zzz-card-cap')).toBe('25');
    expect(btn.style.getPropertyValue('--zzz-card-gap')).toBe('9');
    rerender(<ItemCard size="list" empty />);
    expect(btn.style.getPropertyValue('--zzz-card-cap')).toBe('23');
  });

  it('custom caption stays exposed; caption={false} hides the capsule', () => {
    const { rerender } = render(<ItemCard caption="MAX" />);
    expect(screen.getByText('MAX').closest('[aria-hidden="true"]')).toBeNull();
    rerender(<ItemCard caption={false} level={1} />);
    expect(screen.queryByText('Lv. 1')).toBeNull();
  });

  it('selected sets data-selected and aria-pressed', () => {
    const { rerender } = render(<ItemCard selected />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('data-selected');
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    rerender(<ItemCard selected={false} />);
    expect(btn).not.toHaveAttribute('data-selected');
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    rerender(<ItemCard />);
    expect(btn).not.toHaveAttribute('aria-pressed');
  });

  it('beat only applies while selected', () => {
    const { rerender } = render(<ItemCard beat />);
    expect(screen.getByRole('button')).not.toHaveAttribute('data-beat');
    rerender(<ItemCard beat selected />);
    expect(screen.getByRole('button')).toHaveAttribute('data-beat');
  });

  it('activates with click, Enter and Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ItemCard name="x" onClick={onClick} />);
    await user.click(screen.getByRole('button'));
    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('disabled blocks activation without a visual style change', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ItemCard name="x" disabled onClick={onClick} />);
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('interactive={false} renders a static div', () => {
    const { container } = render(<ItemCard interactive={false} name="x" disabled />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(container.firstElementChild?.tagName).toBe('DIV');
    expect(container.firstElementChild).not.toHaveAttribute('disabled');
  });

  it('inside an ItemGrid cell it renders a div and takes size/selected from context', () => {
    const { container } = render(
      <ItemGridItemContext.Provider value={{ size: 'material', selected: true }}>
        <ItemCard name="x" />
      </ItemGridItemContext.Provider>
    );
    const el = container.firstElementChild!;
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveClass('zzz-item-card--material');
    expect(el).toHaveAttribute('data-selected');
  });

  it('passes props, className, style and ref through', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<ItemCard ref={ref} className="extra" style={{ marginLeft: 3 }} data-testid="c" title="t" />);
    const el = screen.getByTestId('c');
    expect(ref.current).toBe(el);
    expect(el).toHaveClass('extra');
    expect(el).toHaveAttribute('title', 't');
    expect(el.style.marginLeft).toBe('3px');
    expect(el.style.getPropertyValue('--zzz-card-w')).toBe('118');
  });
});
