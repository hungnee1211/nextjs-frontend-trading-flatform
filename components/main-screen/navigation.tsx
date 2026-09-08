'use client';

import React, { useState } from 'react';
import { Search, Bell, X } from 'lucide-react';

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearchChange?: (query: string) => void; // Optional: gửi từ khóa tìm kiếm ra ngoài
}

const TAGS = [
  'Tất cả',
  'bStocks',
  'tCommodities',
  'BSC',
  'Solana',
  'RWA',
  'MEME',
  'Thanh toán',
  'AI',
  'Lớp 1 / Lớp 2',
  'Hạt giống',
  'Launchpool',
  'Megadrop',
  'Gaming',
];

export function NavigationTabs({
  activeTab,
  setActiveTab,
  onSearchChange,
}: NavigationTabsProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#2b313a]/50 pb-2">
        {/* Navigation Links */}
        <div className="flex space-x-6 font-medium text-xs md:text-sm overflow-x-auto no-scrollbar">
          <span className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer whitespace-nowrap">
            Danh sách yêu thích
          </span>
          <span className="text-gray-900 dark:text-white border-b-2 border-[#F0B90B] pb-2 cursor-pointer whitespace-nowrap">
            Tiền mã hóa
          </span>
          <span className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer whitespace-nowrap">
            Giao ngay
          </span>
          <span className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer whitespace-nowrap">
            Hợp đồng Tương lai
          </span>
          <span className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer relative whitespace-nowrap">
            TradFi{' '}
            <span className="absolute -top-2 -right-6 text-[9px] bg-[#F0B90B] text-black px-1 rounded font-bold">
              Mới
            </span>
          </span>
          <span className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer whitespace-nowrap">
            Alpha
          </span>
          <span className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer whitespace-nowrap">
            Mới
          </span>
          <span className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer whitespace-nowrap">
            Khu vực
          </span>
        </div>

        {/* Right Actions: Input Search & Bell */}
        <div className="flex items-center space-x-3 text-gray-400 dark:text-gray-500 ml-4">
          <div className="relative flex items-center">
            {/* Input Container - Trượt mở sang trái khi click */}
            <div
              className={`flex items-center bg-gray-100 dark:bg-[#2b313a] rounded-lg border border-gray-200 dark:border-[#363c4e] transition-all duration-300 ease-in-out overflow-hidden ${
                isSearchOpen ? 'w-48 md:w-60 px-2.5 py-1 opacity-100' : 'w-0 opacity-0 border-none p-0'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Tìm kiếm coin..."
                className="bg-transparent text-gray-900 dark:text-white text-xs outline-none w-full placeholder-gray-400 dark:placeholder-gray-500"
                autoFocus={isSearchOpen}
              />
              {searchQuery && (
                <X
                  className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer flex-shrink-0 ml-1"
                  onClick={handleCloseSearch}
                />
              )}
            </div>

            {/* Nut Kinh lup Search - An khi o input mo */}
            {!isSearchOpen && (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-1 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Tìm kiếm"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          <Bell className="w-4 h-4 cursor-pointer hover:text-gray-900 dark:hover:text-white flex-shrink-0" />
        </div>
      </div>

      {/* Tags Slider */}
      <div className="flex items-center space-x-2 overflow-x-auto py-2 text-xs no-scrollbar">
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTab(tag)}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === tag
                ? 'bg-[#2b313a] dark:bg-[#2b313a] text-white font-medium'
                : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2b313a]/50 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tag}{' '}
            {tag === 'bStocks' && (
              <span className="text-[9px] bg-[#F0B90B] text-black px-1 rounded ml-1 font-bold">
                Mới
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}