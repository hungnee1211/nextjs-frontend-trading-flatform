'use client';

import { formatNumber, formatUsd } from '@/lib/format';
import { AssetDisplay } from '@/types/wallet';
import { memo } from 'react';

interface Props {
  asset: AssetDisplay;
  hideBalance: boolean;
  showWalletType?: boolean;
}

function AssetRowInner({ asset, hideBalance, showWalletType }: Props) {
  const usdValue = asset.total * asset.usdPrice;
  const walletType = asset.walletType || 'SPOT';
  const isSpot = walletType === 'SPOT';

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-[#2b313a]/50 transition-colors">
      <td className="py-4 px-4 font-medium flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-xs">
          {asset.icon.slice(0, 3)}
        </div>
        <div>
          <div>{asset.asset}</div>
          <div className="text-xs text-gray-400 font-normal">{asset.name}</div>
        </div>
      </td>
      {showWalletType && (
        <td className="py-4 px-4 text-center">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            isSpot ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
          }`}>
            {isSpot ? 'Spot' : 'Funding'}
          </span>
        </td>
      )}
      <td className="py-4 px-4">{hideBalance ? '****' : formatNumber(asset.total)}</td>
      <td className="py-4 px-4">{hideBalance ? '****' : formatNumber(asset.available)}</td>
      <td className="py-4 px-4">{hideBalance ? '****' : formatNumber(asset.locked)}</td>
      <td className="py-4 px-4 text-right font-medium">
        {hideBalance ? '****' : formatUsd(usdValue)}
      </td>
    </tr>
  );
}

// So sánh nông theo từng field cần thiết thay vì so sánh cả object `asset`
// (object mới được tạo lại mỗi lần map ở component cha) để memo thực sự có tác dụng.
export const AssetRow = memo(AssetRowInner, (prev, next) => {
  return (
    prev.hideBalance === next.hideBalance &&
    prev.showWalletType === next.showWalletType &&
    prev.asset.asset === next.asset.asset &&
    prev.asset.available === next.asset.available &&
    prev.asset.locked === next.asset.locked &&
    prev.asset.total === next.asset.total &&
    prev.asset.usdPrice === next.asset.usdPrice &&
    prev.asset.walletType === next.asset.walletType
  );
});