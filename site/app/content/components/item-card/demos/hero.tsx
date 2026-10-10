import { AttackIcon, ItemCard, StunIcon, SupportIcon } from '@angel1254mc/zone-ui';
import { AgentImage, WEngineImage } from 'examples/art';

export default function ItemCardHero() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
      <ItemCard
        name="The Brimstone"
        rarity="s"
        art={<WEngineImage id="14104" alt="" />}
        specialty={<AttackIcon />}
        level={60}
        stars={1}
        locked
        avatar={<AgentImage id="1041" crop="circle" alt="" />}
        equippedBy="Soldier 11"
        selected
      />
      <ItemCard
        name="Hellfire Gears"
        rarity="s"
        art={<WEngineImage id="14110" alt="" />}
        specialty={<StunIcon />}
        level={60}
        stars={2}
      />
      <ItemCard
        name="The Vault"
        rarity="a"
        art={<WEngineImage id="13103" alt="" />}
        specialty={<SupportIcon />}
        level={50}
        stars={5}
      />
      <ItemCard
        name="[Lunar] Pleniluna"
        rarity="b"
        art={<WEngineImage id="12001" alt="" />}
        specialty={<AttackIcon />}
        level={40}
        stars={3}
      />
    </div>
  );
}
