import { Button, ItemCard } from '@angel1254mc/zone-ui';
import { ItemImage } from 'examples/art';

const ingredients = [
  { id: '511', name: 'Prepaid Power Card', owned: 6, required: 1 },
  { id: '501', name: 'Battery Charge', owned: 20, required: 60 },
];

export default function CraftingCost() {
  const short = ingredients.some((i) => i.owned < i.required);
  return (
    <div style={{ display: 'grid', gap: 24, justifyItems: 'center' }}>
      <div style={{ display: 'flex', gap: 20 }}>
        {ingredients.map((i) => (
          <ItemCard
            key={i.id}
            size="ingredient"
            interactive={false}
            name={i.name}
            rarity="a"
            count={{ owned: i.owned, required: i.required }}
            art={<ItemImage id={i.id} alt="" />}
          />
        ))}
      </div>
      <Button width="wide" disabled={short}>
        {short ? 'Not enough materials' : 'Craft'}
      </Button>
    </div>
  );
}
