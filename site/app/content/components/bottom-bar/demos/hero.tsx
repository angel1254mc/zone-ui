import { BottomBar, Button, CompareIcon, EnhanceIcon, RecommendIcon } from '@angel1254mc/zone-ui';

export default function BottomBarHero() {
  return (
    <div style={{ paddingTop: 48 }}>
      <BottomBar
        left={
          <>
            <Button width="compact" icon={<CompareIcon />} iconTone="compare">
              Compare
            </Button>
            <Button width="compact" icon={<RecommendIcon />} iconTone="recommend">
              Recommend
            </Button>
          </>
        }
        right={
          <Button width="compact" icon={<EnhanceIcon />}>
            Enhance
          </Button>
        }
      />
    </div>
  );
}
