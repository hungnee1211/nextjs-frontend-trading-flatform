'use client';

export type TabKey = 'overview' | 'spot' | 'funding';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Tổng quan' },
  { key: 'spot', label: 'Ví Spot' },
  { key: 'funding', label: 'Ví Funding' },
];

interface Props {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

export function WalletTabs({ active, onChange }: Props) {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`pb-3 px-4 font-medium text-sm transition-colors relative ${
            active === tab.key
              ? 'text-yellow-500 border-b-2 border-yellow-500'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}