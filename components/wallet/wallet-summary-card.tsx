'use client';

import { Eye, EyeOff, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatUsd } from '@/lib/format';

interface Props {
  totalUsd: number;
  activeTab: 'overview' | 'spot' | 'funding';
  hideBalance: boolean;
  onToggleHide: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenTransfer: () => void;
}

export function WalletSummaryCard({
  totalUsd,
  activeTab,
  hideBalance,
  onToggleHide,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenTransfer,
}: Props) {
  const tabLabels = {
    overview: 'Tổng số dư ước tính',
    spot: 'Số dư Ví Spot',
    funding: 'Số dư Ví Funding',
  };

  const tabColors = {
    overview: 'text-gray-500 dark:text-gray-400 font-medium',
    spot: 'text-green-700 dark:text-green-400 font-medium',
    funding: 'text-purple-700 dark:text-purple-400 font-medium',
  };

  return (
    <div className="bg-white dark:bg-[#1e2329] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm mb-1">
            <span className={tabColors[activeTab]}>{tabLabels[activeTab]}</span>
            <button onClick={onToggleHide} className="focus:outline-none" aria-label="Ẩn/hiện số dư">
              {hideBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="text-3xl font-bold">{hideBalance ? '********' : formatUsd(totalUsd)}</div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={onOpenDeposit}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium flex items-center gap-2"
          >
            <ArrowDownToLine className="w-4 h-4" /> Nạp
          </Button>
          <Button
            onClick={onOpenWithdraw}
            variant="outline"
            className="border-gray-300 dark:border-gray-700 flex items-center gap-2"
          >
            <ArrowUpFromLine className="w-4 h-4" /> Rút
          </Button>
          <Button
            onClick={onOpenTransfer}
            variant="outline"
            className="border-gray-300 dark:border-gray-700 flex items-center gap-2"
          >
            <ArrowLeftRight className="w-4 h-4" /> Chuyển
          </Button>
        </div>
      </div>
    </div>
  );
}