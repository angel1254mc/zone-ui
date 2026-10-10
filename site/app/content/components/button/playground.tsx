import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { Button, CheckIcon, CloseIcon, FilterIcon, SegmentedTabs, Select, Switch } from '@angel1254mc/zone-ui';
import type { ButtonProps } from '@angel1254mc/zone-ui';
import { CodeBlock } from '../../../ui/CodeBlock';

type Size = 'sm' | 'md' | 'lg';
type Tone = 'none' | 'plain' | 'confirm' | 'cancel';

const ICONS: Record<Exclude<Tone, 'none'>, ReactNode> = {
  plain: <FilterIcon />,
  confirm: <CheckIcon />,
  cancel: <CloseIcon />,
};

function Field({ label, children }: { label: string; children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <div className="d-play__field">
      <label htmlFor={id} className="d-play__label">
        {label}
      </label>
      {children(id)}
    </div>
  );
}

/** Live props for Button: change a control and the button and its code update. */
export function ButtonPlayground() {
  const [size, setSize] = useState<Size>('md');
  const [tone, setTone] = useState<Tone>('confirm');
  const [width, setWidth] = useState<NonNullable<ButtonProps['width']>>('dialog');
  const [pressed, setPressed] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const attrs = [
    size !== 'md' && `size="${size}"`,
    width !== 'default' && (typeof width === 'number' ? `width={${width}}` : `width="${width}"`),
    tone !== 'none' && `icon={<${tone === 'plain' ? 'FilterIcon' : tone === 'confirm' ? 'CheckIcon' : 'CloseIcon'} />}`,
    tone !== 'none' && tone !== 'plain' && `iconTone="${tone}"`,
    pressed && 'pressed',
    disabled && 'disabled',
  ].filter(Boolean);
  const code = `<Button${attrs.length ? '\n  ' + attrs.join('\n  ') + '\n' : ''}>\n  Confirm\n</Button>`;

  return (
    <section className="d-play" aria-label="Button playground">
      <div className="d-play__stage">
        <Button
          size={size}
          width={width}
          icon={tone === 'none' ? undefined : ICONS[tone]}
          iconTone={tone === 'none' || tone === 'plain' ? undefined : tone}
          pressed={pressed}
          disabled={disabled}
        >
          Confirm
        </Button>
      </div>
      <div className="d-play__controls">
        <Field label="size">
          {(id) => (
            <SegmentedTabs
              id={id}
              size="sm"
              width={360}
              aria-label="size"
              value={size}
              onValueChange={(v) => setSize(v as Size)}
              items={[
                { value: 'sm', label: 'sm' },
                { value: 'md', label: 'md' },
                { value: 'lg', label: 'lg' },
              ]}
            />
          )}
        </Field>
        <Field label="width">
          {(id) => (
            <Select
              id={id}
              size="sm"
              width={220}
              value={String(width)}
              onValueChange={(v) => setWidth(v as NonNullable<ButtonProps['width']>)}
              options={['auto', 'compact', 'default', 'dialog', 'wide'].map((v) => ({ value: v, label: v }))}
            />
          )}
        </Field>
        <Field label="icon / iconTone">
          {(id) => (
            <Select
              id={id}
              size="sm"
              width={220}
              value={tone}
              onValueChange={(v) => setTone(v as Tone)}
              options={[
                { value: 'none', label: 'no icon' },
                { value: 'plain', label: 'glyph only' },
                { value: 'confirm', label: 'confirm' },
                { value: 'cancel', label: 'cancel' },
              ]}
            />
          )}
        </Field>
        <Field label="pressed">
          {(id) => <Switch id={id} size="sm" checked={pressed} onCheckedChange={setPressed} />}
        </Field>
        <Field label="disabled">
          {(id) => <Switch id={id} size="sm" checked={disabled} onCheckedChange={setDisabled} />}
        </Field>
      </div>
      <CodeBlock code={code} title="Current props" />
    </section>
  );
}
