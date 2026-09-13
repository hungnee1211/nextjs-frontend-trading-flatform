'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useWalletBalances } from '@/stores/useWalletBalanceStore';
import { useDebouncedValue } from '@/stores/usedeboundcedvalue';
import { WalletTabs, type TabKey } from '@/components/wallet/wallet-tabs';
import { WalletSummaryCard } from '@/components/wallet/wallet-summary-card';
import { AssetSearchControls } from '@/components/wallet/asset-search-control';
import { AssetsTable } from '@/components/wallet/asset-stable';

// Chỉ tải code của modal khi người dùng thực sự bấm Nạp/Rút/Chuyển,
// giảm kích thước bundle JS ban đầu của trang ví.
const DepositModal = dynamic(() => import('@/components/wallet/desposit-modal'), { ssr: false });
const WithdrawModal = dynamic(() => import('@/components/wallet/withdraw-modal'), { ssr: false });
const TransferModal = dynamic(() => import('@/components/wallet/transfer-modal'), { ssr: false });

export default function WalletPage() {
  const router = useRouter();
  const { user, isInitialized } = useAuthStore();

  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [hideBalance, setHideBalance] = useState(false);
  const [hideSmallAssets, setHideSmallAssets] = useState(true);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState<'deposit' | 'withdraw' | 'transfer' | null>(null);

  // Debounce input tìm kiếm 250ms để không lọc lại danh sách trên mỗi phím gõ
  const debouncedSearch = useDebouncedValue(search, 250);

  const { assets, loading, error, refetch } = useWalletBalances(!!user);

  useEffect(() => {
    if (isInitialized && !user) {
      router.push('/login');
    }
  }, [isInitialized, user, router]);

  const totalUsd = useMemo(
    () => {
      let result = assets;
      if (activeTab === 'spot') {
        result = result.filter((a) => a.walletType === 'SPOT');
      } else if (activeTab === 'funding') {
        result = result.filter((a) => a.walletType === 'FUNDING');
      }
      return result.reduce((sum, a) => sum + a.total * a.usdPrice, 0);
    },
    [assets, activeTab]
  );

  // Lọc tài sản theo tab đang chọn
  const filteredAssets = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    let result = assets;

    // Lọc theo wallet type dựa trên tab
    if (activeTab === 'spot') {
      result = result.filter((a) => a.walletType === 'SPOT');
    } else if (activeTab === 'funding') {
      result = result.filter((a) => a.walletType === 'FUNDING');
    }
    // 'overview' hiển thị tất cả

    return result
      .filter((a) =>
        term ? a.asset.toLowerCase().includes(term) || a.name.toLowerCase().includes(term) : true
      )
      .filter((a) => (hideSmallAssets ? a.total * a.usdPrice >= 1 : true));
  }, [assets, debouncedSearch, hideSmallAssets, activeTab]);

  const handleRefresh = useCallback(() => refetch(), [refetch]);
  const closeModal = useCallback(() => setOpenModal(null), []);

  if (!isInitialized) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10 animate-pulse">
        <div className="h-32 bg-gray-100 dark:bg-[#2b313a] rounded-lg mb-6" />
        <div className="h-64 bg-gray-100 dark:bg-[#2b313a] rounded-lg" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-gray-900 dark:text-gray-100">
      <WalletTabs active={activeTab} onChange={setActiveTab} />

      <WalletSummaryCard
        totalUsd={totalUsd}
        activeTab={activeTab}
        hideBalance={hideBalance}
        onToggleHide={() => setHideBalance((v) => !v)}
        onOpenDeposit={() => setOpenModal('deposit')}
        onOpenWithdraw={() => setOpenModal('withdraw')}
        onOpenTransfer={() => setOpenModal('transfer')}
      />

      <div className="bg-white dark:bg-[#1e2329] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <AssetSearchControls
          search={search}
          onSearchChange={setSearch}
          hideSmallAssets={hideSmallAssets}
          onToggleHideSmall={setHideSmallAssets}
          onRefresh={handleRefresh}
          refreshing={loading}
        />

        {error && (
          <p className="text-sm text-red-500 mb-4">
            {error} —{' '}
            <button onClick={handleRefresh} className="underline">
              thử lại
            </button>
          </p>
        )}

        <AssetsTable assets={filteredAssets} loading={loading} hideBalance={hideBalance} activeTab={activeTab} />
      </div>

      {openModal === 'deposit' && <DepositModal onClose={closeModal} onSuccess={refetch} />}
      {openModal === 'withdraw' && (
        <WithdrawModal assets={assets} onClose={closeModal} onSuccess={refetch} />
      )}
      {openModal === 'transfer' && (
        <TransferModal
          assets={assets}
          onClose={closeModal}
          onSuccess={(balances) => {
            if (balances) {
              // Đợi 100ms để MongoDB commit xong transaction trước khi refetch
              setTimeout(refetch, 100);
            } else {
              refetch();
            }
          }}
        />
      )}
    </div>
  );
}