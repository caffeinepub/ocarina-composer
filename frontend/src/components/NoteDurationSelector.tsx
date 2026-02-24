import { NoteDuration } from '../types/music';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface NoteDurationSelectorProps {
  selectedDuration: NoteDuration;
  onDurationChange: (duration: NoteDuration) => void;
}

const durations: { value: NoteDuration; label: string; symbol: string }[] = [
  { value: 'whole', label: 'Whole', symbol: '𝅝' },
  { value: 'half', label: 'Half', symbol: '𝅗𝅥' },
  { value: 'quarter', label: 'Quarter', symbol: '♩' },
  { value: 'eighth', label: 'Eighth', symbol: '♪' },
  { value: 'sixteenth', label: '16th', symbol: '𝅘𝅥𝅯' },
];

export function NoteDurationSelector({ selectedDuration, onDurationChange }: NoteDurationSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {durations.map((duration) => (
        <Button
          key={duration.value}
          onClick={() => onDurationChange(duration.value)}
          variant={selectedDuration === duration.value ? 'default' : 'outline'}
          size="lg"
          className={cn(
            'flex flex-col items-center gap-1 h-auto py-3 px-4',
            selectedDuration === duration.value && 'ring-2 ring-primary'
          )}
        >
          <span className="text-2xl">{duration.symbol}</span>
          <span className="text-xs">{duration.label}</span>
        </Button>
      ))}
    </div>
  );
}
