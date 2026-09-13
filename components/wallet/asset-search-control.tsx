'use client';

import { RefreshCw, Search } from 'lucide-react';

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  hideSmallAssets: boolean;
  onToggleHideSmall: (value: boolean) => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export function AssetSearchControls({
  search,
  onSearchChange,
  hideSmallAssets,
  onToggleHideSmall,
  onRefresh,
  refreshing,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm coin..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#2b313a] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-yellow-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={hideSmallAssets}
            onChange={(e) => onToggleHideSmall(e.target.checked)}
            className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
          />
          Ẩn tài sản nhỏ (&lt; $1)
        </label>
        <button
          onClick={onRefresh}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Làm mới"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
}