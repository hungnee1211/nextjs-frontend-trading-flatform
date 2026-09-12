'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  RefreshCw,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/useAuthStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface Asset {
  symbol: string;
  name: string;
  icon?: string;
  balance: number;
  available: number;
  frozen: number;
  usdPrice: number;
}

type TabKey = 'overview' | 'spot' | 'funding';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Tổng quan' },
  { key: 'spot', label: 'Ví Spot' },
  { key: 'funding', label: 'Ví Funding' },
];

export default function WalletPage() {
  const router = useRouter();
  const { user, isInitialized } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [hideSmallAssets, setHideSmallAssets] = useState(true);
  const [search, setSearch] = useState('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isInitialized && !user) {
      router.push('/login');
    }
  }, [mounted, isInitialized, user, router]);

  useEffect(() => {
    if (!user) return;

    const fetchAssets = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/wallet/assets`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch assets');
        const data = await res.json();
        setAssets(data.assets || []);
      } catch (err) {
        console.error('Fetch wallet assets error:', err);
        setAssets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [user]);

  if (!mounted || !isInitialized) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10 animate-pulse">
        <div className="h-32 bg-gray-100 dark:bg-[#2b313a] rounded-lg mb-6" />
        <div className="h-64 bg-gray-100 dark:bg-[#2b313a] rounded-lg" />
      </div>
    );
  }

  if (!user) return null;

  const totalUsd = assets.reduce((sum, a) => sum + a.balance * a.usdPrice, 0);

  const filteredAssets = assets
    .filter((a) =>
      search
        ? a.symbol.toLowerCase().includes(search.toLowerCase()) ||
          a.name.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .filter((a) => {
      if (!hideSmallAssets) return true;
      return a.balance * a.usdPrice >= 1;
    });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-gray-900 dark:text-gray-100">
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 px-4 font-medium text-sm transition-colors relative ${
              activeTab === tab.key
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#1e2329] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
              <span>Tổng số dư ước tính</span>
              <button
                onClick={() => setHideBalance(!hideBalance)}
                className="focus:outline-none"
              >
                {hideBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-3xl font-bold">
              {hideBalance
                ? '********'
                : `$${totalUsd.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium flex items-center gap-2">
              <ArrowDownToLine className="w-4 h-4" /> Nạp
            </Button>
            <Button variant="outline" className="border-gray-300 dark:border-gray-700 flex items-center gap-2">
              <ArrowUpFromLine className="w-4 h-4" /> Rút
            </Button>
            <Button variant="outline" className="border-gray-300 dark:border-gray-700 flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4" /> Chuyển
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e2329] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm coin..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#2b313a] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={hideSmallAssets}
                onChange={(e) => setHideSmallAssets(e.target.checked)}
                className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
              />
              Ẩn tài sản nhỏ (&lt; $1)
            </label>
            <button
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 500);
              }}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-xs text-gray-400 uppercase">
                <th className="py-3 px-4">Tài sản</th>
                <th className="py-3 px-4">Tổng số dư</th>
                <th className="py-3 px-4">Có sẵn</th>
                <th className="py-3 px-4">Đang khóa</th>
                <th className="py-3 px-4 text-right">Giá trị quy đổi (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    Không tìm thấy tài sản nào
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => {
                  const assetUsdValue = asset.balance * asset.usdPrice;
                  return (
                    <tr
                      key={asset.symbol}
                      className="hover:bg-gray-50 dark:hover:bg-[#2b313a]/50 transition-colors"
                    >
                      <td className="py-4 px-4 font-medium flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-xs">
                          {asset.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <div>{asset.symbol}</div>
                          <div className="text-xs text-gray-400 font-normal">
                            {asset.name}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {hideBalance ? '****' : asset.balance.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        {hideBalance ? '****' : asset.available.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        {hideBalance ? '****' : asset.frozen.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        {hideBalance
                          ? '****'
                          : `$${assetUsdValue.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}