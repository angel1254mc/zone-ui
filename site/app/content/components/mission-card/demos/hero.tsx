import { MissionCard } from '@angel1254mc/zone-ui';
import { AgentImage } from 'examples/art';

export default function MissionCardHero() {
  return (
    <MissionCard
      title='Check in for a total of 14 days in the "Surprise Screening Plan" to obtain'
      reward={<AgentImage crop="circle" id="1011" alt="" />}
      rewardLabel="Outfit reward"
      isNew
      onGo={() => {}}
      onInspect={() => {}}
    />
  );
}
