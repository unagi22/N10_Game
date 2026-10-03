import React from 'react';
import { CalendarDays, RotateCcw, Zap } from 'lucide-react';
import { cn } from '../utils/cn';

interface GameControlsProps {
  beastMode: boolean;
  dailyMode: boolean;
  dailyDone: boolean;
  classicLeft: number;
  onDaily: () => void;
  onBeastMode: () => void;
  onReset: () => void;
}

function ControlButton({
  onClick, icon, label, sub, active, tone,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  sub?: string;
  active?: boolean;
  tone: 'sky' | 'rose' | 'slate';
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl border px-2 py-2.5 transition active:scale-95',
        tone === 'sky' && (active ? 'border-sky-400/60 bg-sky-400/20' : 'border-sky-400/20 bg-sky-400/10 hover:bg-sky-400/20'),
        tone === 'rose' && (active ? 'border-rose-400/60 bg-rose-500/25' : 'border-rose-400/20 bg-rose-500/10 hover:bg-rose-500/20'),
        tone === 'slate' && 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10'
      )}
    >
      {icon}
      <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">{label}</span>
      {sub && <span className="text-[10px] text-slate-500 dark:text-slate-400">{sub}</span>}
    </button>
  );
}

export function GameControls({ beastMode, dailyMode, dailyDone, classicLeft, onDaily, onBeastMode, onReset }: GameControlsProps) {
  return (
    <nav className="flex gap-2">
      <ControlButton
        onClick={onDaily}
        tone="sky"
        active={dailyMode}
        icon={<CalendarDays className="h-5 w-5 text-sky-600 dark:text-sky-300" />}
        label="Daily"
        sub={dailyDone ? 'Results' : 'Play today'}
      />
      <ControlButton
        onClick={onBeastMode}
        tone="rose"
        active={beastMode}
        icon={<Zap className="h-5 w-5 text-rose-600 dark:text-rose-300" />}
        label="Beast"
        sub="12 seconds"
      />
      <ControlButton
        onClick={onReset}
        tone="slate"
        icon={<RotateCcw className="h-5 w-5 text-slate-600 dark:text-slate-300" />}
        label="New game"
        sub={classicLeft === 0 ? 'Back tomorrow' : `${classicLeft} left today`}
      />
    </nav>
  );
}
