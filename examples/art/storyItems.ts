/**
 * A static list of real items for the docs and examples, so visible LABELS never depend on the
 * manifest (no text swap). Every id resolves with an icon in art-manifest.json (the generator
 * fails if one does not). Use with `<ItemImage id={item.id} />`.
 */
export interface StoryItem {
  id: string;
  name: string;
  rarity: 's' | 'a' | 'b' | 'c';
}

export const STORY_ITEMS: readonly StoryItem[] = [
  { id: '10', name: 'Denny', rarity: 'b' },
  { id: '100', name: 'Polychrome', rarity: 's' },
  { id: '110', name: 'Master Tape', rarity: 's' },
  { id: '112', name: 'Boopon', rarity: 's' },
  { id: '301', name: 'W-Engine Chip', rarity: 'a' },
  { id: '404', name: 'Lost Supply Box', rarity: 'a' },
  { id: '501', name: 'Battery Charge', rarity: 'a' },
  { id: '502', name: 'Ether Battery', rarity: 'a' },
  { id: '511', name: 'Prepaid Power Card', rarity: 'a' },
  { id: '100110', name: 'Basic Physical Chip', rarity: 'c' },
  { id: '103040', name: 'Hi-Fi Master Copy', rarity: 's' },
  { id: '300003', name: 'Senior Investigator Log', rarity: 'a' },
  { id: '301003', name: 'W-Engine Energy Module', rarity: 'a' },
  { id: '303002', name: 'Bangboo Algorithm Module', rarity: 'b' },
];
