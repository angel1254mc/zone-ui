import { Button, CompareIcon, RecommendIcon, RecycleIcon, ResetIcon } from '@angel1254mc/zone-ui';

export default function IconTones() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      <Button icon={<RecycleIcon />} iconTone="recycle" width="wide">
        Dismantle
      </Button>
      <Button icon={<ResetIcon />} iconTone="reset" width="wide">
        Reset
      </Button>
      <Button icon={<CompareIcon />} iconTone="compare" width="compact">
        Compare
      </Button>
      <Button icon={<RecommendIcon />} iconTone="recommend" width="compact">
        Recommend
      </Button>
    </div>
  );
}
