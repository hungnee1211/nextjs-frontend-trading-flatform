'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { CoinData } from '@/types/crypto';
import { Header } from '@/components/header';
import { CoinTable } from '@/components/main-screen/coin-table';
import { NavigationTabs } from '@/components/main-screen/navigation';
import { StatCardsSection } from '@/components/main-screen/start-card-section';
import { SupportButton } from '@/components/support-button';
import { TradingDataSection } from '@/components/market-cap/trading-data-section';
import { ChartView } from '@/components/field/chart-view';

export default function BinanceMarketOverview() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mainTab, setMainTab] = useState<'overview' | 'tradingData'>('overview');
  const [activeTab, setActiveTab] = useState('Tất cả');

  // --- STATE TÌM KIẾM ---
  const [searchQuery, setSearchQuery] = useState<string>('');

  // --- STATE QUẢN LÝ COIN ĐƯỢC CHỌN VÀ DATA CHART ---
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null);
  const [timeframe, setTimeframe] = useState('7');
  const [chartData, setChartData] = useState<{ time: string; price: number }[]>([]);
  const [loadingChart, setLoadingChart] = useState<boolean>(false);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h'
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          setCoins(data);
          // Set coin mặc định là coin đầu tiên (BTC) nếu chưa có selectedCoin
          if (!selectedCoin && data.length > 0) {
            setSelectedCoin(data[0]);
          }
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, []);

  // --- LOGIC LỌC COIN THEO SYMBOL HOẶC TÊN ---
  const filteredCoins = useMemo(() => {
    if (!searchQuery.trim()) return coins;
    const query = searchQuery.toLowerCase().trim();
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(query) ||
        coin.symbol.toLowerCase().includes(query)
    );
  }, [coins, searchQuery]);

  // --- FETCH DỮ LIỆU BIỂU ĐỒ MỖI KHI SELECTED COIN HOẶC TIMEFRAME THAY ĐỔI ---
  useEffect(() => {
    if (!selectedCoin) return;

    const fetchChartData = async () => {
      setLoadingChart(true);
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${selectedCoin.id}/market_chart?vs_currency=usd&days=${timeframe}`
        );
        const data = await res.json();
        if (data && data.prices) {
          const formatted = data.prices.map(([timestamp, price]: [number, number]) => ({
            time: new Date(timestamp).toLocaleDateString(),
            price,
          }));
          setChartData(formatted);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu biểu đồ:', error);
      } finally {
        setLoadingChart(false);
      }
    };

    fetchChartData();
  }, [selectedCoin?.id, timeframe]);

  const formatCompact = (num: number) => {
    if (!num) return '$0';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#181a20] text-gray-900 dark:text-[#eaecef] font-sans text-xs md:text-sm transition-colors duration-200"> 

      <div role="main" className="max-w-[1280px] mx-auto px-4 py-6 space-y-8">
        {/* Main Navigation Tabs */}
        <div className="flex items-center space-x-6 text-base font-semibold border-b border-[#2b313a]/50 pb-2">
          <span
            onClick={() => setMainTab('overview')}
            className={`pb-2 cursor-pointer transition-colors ${
              mainTab === 'overview'
                ? 'text-white border-b-2 border-[#F0B90B]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Tổng quan
          </span>
          <span
            onClick={() => setMainTab('tradingData')}
            className={`pb-2 cursor-pointer transition-colors ${
              mainTab === 'tradingData'
                ? 'text-white border-b-2 border-[#F0B90B]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Dữ liệu Giao dịch
          </span>
          <span className="text-gray-400 hover:text-white cursor-pointer pb-2">
            Lựa chọn của AI
          </span>
          <span className="text-gray-400 hover:text-white cursor-pointer pb-2">
            Mở khóa token
          </span>
        </div>

        {/* Dynamic Render theo State */}
        {mainTab === 'overview' ? (
          <>
            <StatCardsSection coins={coins} formatCompact={formatCompact} />

            {/* Hiển thị Biểu đồ tương ứng với coin đang chọn */}
            {selectedCoin && (
              <ChartView
                selectedCoin={selectedCoin}
                timeframe={timeframe}
                setTimeframe={setTimeframe}
                chartData={chartData}
                loading={loadingChart}
              />
            )}

            <NavigationTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onSearchChange={(query) => setSearchQuery(query)}
            />

            <div>
              <h2 className="text-lg font-bold text-white">
                Top token theo vốn hóa thị trường
              </h2>
              <div className="flex items-center justify-between text-gray-400 text-xs mt-1">
                <p>
                  Nhận dữ liệu thu thập tổng quan về tất cả các loại tiền mã hóa có
                  sẵn trên Binance. Trang này hiển thị giá mới nhất, khối lượng giao
                  dịch trong 24 giờ, biến động giá và vốn hóa thị trường...
                </p>
                <button className="flex items-center text-gray-300 hover:text-[#F0B90B] whitespace-nowrap ml-2">
                  Nhều hơn <ChevronRight className="w-3 h-3 ml-0.5" />
                </button>
              </div>
            </div>

            {/* Truyền mảng filteredCoins thay cho coins */}
            <CoinTable
              coins={filteredCoins}
              loading={loading}
              formatCompact={formatCompact}
              onSelectCoin={(coin) => setSelectedCoin(coin)}
              selectedCoinId={selectedCoin?.id}
            />
          </>
        ) : (
          <TradingDataSection coins={coins} loading={loading} />
        )}
      </div>

      <SupportButton />
    </div>
  );
}