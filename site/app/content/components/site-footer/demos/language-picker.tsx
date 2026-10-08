import { SegmentedTabs, SiteFooter } from '@angel1254mc/zone-ui';

export default function LanguagePicker() {
  return (
    <SiteFooter
      links={[
        { label: 'Privacy Policy', href: '#privacy' },
        { label: 'Terms of Service', href: '#terms' },
        { label: 'Help Center', href: '#help' },
      ]}
      legal="Copyright © Your Studio. All rights reserved."
    >
      <SegmentedTabs
        aria-label="Language"
        size="sm"
        defaultValue="en"
        items={[
          { value: 'en', label: 'English' },
          { value: 'ja', label: '日本語' },
          { value: 'es', label: 'Español' },
        ]}
      />
    </SiteFooter>
  );
}
