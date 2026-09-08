import React, { useEffect, useState } from 'react';
import axios from 'axios';

// 1. Định nghĩa Interface cho dữ liệu Coin từ CoinGecko
interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

interface MarketData {
  hot: Coin[];
  gainers: Coin[];
  losers: Coin[];
}

const MarketOverview: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  
  // 2. Định kiểu rõ ràng cho State
  const [data, setData] = useState<MarketData>({
    hot: [],
    gainers: [],
    losers: [],
  });

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await axios.get<Coin[]>(
          'https://api.coingecko.com/api/v3/coins/markets',
          {
            params: {
              vs_currency: 'usd',
              order: 'market_cap_desc',
              per_page: 100,
              page: 1,
              sparkline: false,
              price_change_percentage: '24h',
            },
          }
        );

        const rawData = response.data;

        const hotCoins = rawData.slice(0, 8);

        const sortedGainers = [...rawData]
          .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
          .slice(0, 8);

        const sortedLosers = [...rawData]
          .sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0))
          .slice(0, 8);

        setData({
          hot: hotCoins,
          gainers: sortedGainers,
          losers: sortedLosers,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching market data:', error);
        setLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price.toFixed(6)}`;
  };

  const renderTable = (title: string, items: Coin[]) => (
    <div className="bg-[#1e2329] rounded-2xl p-5 border border-gray-800 flex-1 min-w-[300px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-lg font-bold">{title}</h3>
        <span className="text-xs text-gray-400 bg-[#2b313a] px-2 py-1 rounded cursor-pointer">
          Crypto ▾
        </span>
      </div>

      <div className="grid grid-cols-12 text-xs text-gray-400 pb-2 mb-2 border-b border-gray-800">
        <span className="col-span-6">Tên</span>
        <span className="col-span-3 text-right">Giá</span>
        <span className="col-span-3 text-right">Biến động 24h</span>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => {
          const change = item.price_change_percentage_24h || 0;
          const isPositive = change >= 0;
          return (
            <div
              key={item.id}
              className="grid grid-cols-12 items-center text-sm hover:bg-[#2b313a]/50 p-1 rounded transition-colors"
            >
              <div className="col-span-6 flex items-center space-x-3 overflow-hidden">
                <span className="text-gray-500 text-xs w-3">{index + 1}</span>
                <img src={item.image} alt={item.name} className="w-5 h-5 rounded-full" />
                <span className="text-white font-semibold uppercase truncate">
                  {item.symbol}
                </span>
              </div>

              <div className="col-span-3 text-right text-white font-medium">
                {formatPrice(item.current_price)}
              </div>

              <div
                className={`col-span-3 text-right font-semibold ${
                  isPositive ? 'text-[#0ecb81]' : 'text-[#f6465d]'
                }`}
              >
                {isPositive ? '+' : ''}
                {change.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-[#0b0e11] min-h-screen text-white flex justify-center items-center">
        Đang tải dữ liệu thị trường...
      </div>
    );
  }

  return (
    <div className="bg-[#0b0e11] min-h-screen p-6 text-slate-100 font-sans">
      <div className="flex space-x-6 border-b border-gray-800 pb-3 mb-6 text-sm font-semibold">
        <button className="text-gray-400 hover:text-white">Tổng quan</button>
        <button className="text-[#f0b90b] border-b-2 border-[#f0b90b] pb-3 -mb-3">
          Dữ liệu Giao dịch
        </button>
        <button className="text-gray-400 hover:text-white">Lựa chọn của AI</button>
        <button className="text-gray-400 hover:text-white">Mở khóa token</button>
      </div>

      <div className="flex space-x-4 mb-6 text-xs text-gray-400">
        <span className="text-white font-bold cursor-pointer">Thứ hạng</span>
        <span className="hover:text-white cursor-pointer">Hợp đồng tương lai USDⓈ-M</span>
        <span className="hover:text-white cursor-pointer">Hợp đồng tương lai COIN-M</span>
        <span className="hover:text-white cursor-pointer">Quyền chọn</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderTable('Coin nổi bật', data.hot)}
        {renderTable('Top tăng giá', data.gainers)}
        {renderTable('Top giảm giá', data.losers)}
      </div>
    </div>
  );
};

export default MarketOverview;