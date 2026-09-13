'use client';

import { AssetDisplay } from '@/types/wallet';
import { AssetRow } from './asset-row';

interface Props {
  assets: AssetDisplay[];
  loading: boolean;
  hideBalance: boolean;
  activeTab: 'overview' | 'spot' | 'funding';
}

export function AssetsTable({ assets, loading, hideBalance, activeTab }: Props) {
  const showWalletType = activeTab === 'overview';

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800 text-xs text-gray-400 uppercase">
            <th className="py-3 px-4">Tài sản</th>
            {showWalletType && <th className="py-3 px-4 text-center">Loại ví</th>}
            <th className="py-3 px-4">Tổng số dư</th>
            <th className="py-3 px-4">Có sẵn</th>
            <th className="py-3 px-4">Đang khóa</th>
            <th className="py-3 px-4 text-right">Giá trị quy đổi (USD)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50 text-sm">
          {loading ? (
            <tr>
              <td colSpan={showWalletType ? 6 : 5} className="py-8 text-center text-gray-400">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : assets.length === 0 ? (
            <tr>
              <td colSpan={showWalletType ? 6 : 5} className="py-8 text-center text-gray-400">
                {activeTab === 'spot' ? 'Chưa có tài sản trong ví Spot' : activeTab === 'funding' ? 'Chưa có tài sản trong ví Funding' : 'Không tìm thấy tài sản nào'}
              </td>
            </tr>
          ) : (
            assets.map((asset) => (
              <AssetRow key={`${asset.asset}-${asset.walletType}`} asset={asset} hideBalance={hideBalance} showWalletType={showWalletType} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}