'use client';

import React, { useState, useEffect } from 'react';
import { Globe, DollarSign, Moon, Sun, MoreHorizontal, MessageSquare } from 'lucide-react';
import { useTheme } from 'next-themes';

export const Footer: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Đảm bảo component chỉ render icon/state sau khi đã mount ở Client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sử dụng resolvedTheme thay cho theme để xử lý chính xác cả khi ở chế độ system
  const isDarkMode = resolvedTheme === 'dark';

  return (
    <footer className="bg-white dark:bg-[#0b0e11] text-gray-600 dark:text-[#848e9c] text-xs font-sans border-t border-gray-200 dark:border-[#2b313a]/40 pt-12 pb-16 px-4 md:px-12 transition-colors">
      <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-6 gap-8">

        {/* Cột 1: Cộng đồng & Cài đặt */}
        <div className="col-span-2 md:col-span-1 space-y-6">
          <div>
            <h3 className="text-gray-900 dark:text-white text-sm font-semibold mb-4">Cộng đồng</h3>
            <div className="flex items-center space-x-4 text-gray-800 dark:text-white">
              <a href="#" className="hover:text-[#f0b90b] transition-colors">
                <span className="font-bold text-base">M</span>
              </a>
              <a href="#" className="hover:text-[#f0b90b] transition-colors">
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-[#f0b90b] transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button className="flex items-center space-x-2 text-gray-800 dark:text-white hover:text-[#f0b90b] transition-colors cursor-pointer">
              <Globe className="w-4 h-4" />
              <span className="font-medium">Tiếng Việt</span>
            </button>

            <button className="flex items-center space-x-2 text-gray-800 dark:text-white hover:text-[#f0b90b] transition-colors cursor-pointer">
              <DollarSign className="w-4 h-4" />
              <span className="font-medium">USD-$</span>
            </button>

            <div className="flex items-center space-x-3 pt-1">
              <span className="text-gray-500 dark:text-gray-400">Chủ đề</span>
              <button
                onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
                className="bg-gray-200 dark:bg-[#2b313a] p-1 rounded-full w-12 h-6 flex items-center transition-colors relative cursor-pointer"
                aria-label="Toggle theme"
              >
                {mounted && (
                  <div
                    className={`w-4 h-4 rounded-full bg-[#f0b90b] flex items-center justify-center transition-transform ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  >
                    {isDarkMode ? (
                      <Moon className="w-2.5 h-2.5 text-black" />
                    ) : (
                      <Sun className="w-2.5 h-2.5 text-black" />
                    )}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Cột 2: Về chúng tôi */}
        <div className="space-y-2.5">
          <h3 className="text-gray-900 dark:text-white text-sm font-semibold mb-4">Về chúng tôi</h3>
          <ul className="space-y-2.5">
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Thông tin thêm</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Cơ hội nghề nghiệp</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Thông báo</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Tin tức</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Báo chí</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Pháp lý</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Điều khoản</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Riêng tư</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Gây dựng niềm tin</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Cộng đồng</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Cảnh báo rủi ro</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Thông báo</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Tải xuống</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Ứng dụng dành cho máy tính để bàn</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Kênh truyền thông nội bộ an toàn</a></li>
          </ul>
        </div>

        {/* Cột 3: Sản phẩm */}
        <div className="space-y-2.5">
          <h3 className="text-gray-900 dark:text-white text-sm font-semibold mb-4">Sản phẩm</h3>
          <ul className="space-y-2.5">
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Exchange</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Mua tiền mã hóa</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Pay</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Thanh toán tiền mã hóa</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Binance Junior</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Academy</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Thẻ quà tặng</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Launchpool</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Đầu tư Tự động</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Staking ETH</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">BABT</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Research</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Charity</a></li>
          </ul>
        </div>

        {/* Cột 4: Kinh doanh & Học hỏi */}
        <div className="space-y-6">
          <div>
            <h3 className="text-gray-900 dark:text-white text-sm font-semibold mb-4">Kinh doanh</h3>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Đăng ký Thương nhân P2P</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Đăng ký niêm yết coin</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Dịch vụ cho tổ chức và VIP</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Lab</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Onchain Pay</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-white text-sm font-semibold mb-4">Học hỏi</h3>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Tìm hiểu kiến thức và kiếm tiền</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Xem giá tiền mã hóa</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Giá Bitcoin</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Giá Ethereum</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Duyệt xem các dự đoán về giá tiền mã hóa</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Dự đoán giá Bitcoin</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Dự đoán giá Ethereum</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Nâng cấp Ethereum (Pectra)</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Mua Bitcoin</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Mua BNB</a></li>
            </ul>
          </div>
        </div>

        {/* Cột 5: Dịch vụ */}
        <div className="space-y-2.5">
          <h3 className="text-gray-900 dark:text-white text-sm font-semibold mb-4">Dịch vụ</h3>
          <ul className="space-y-2.5">
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Affiliate</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Giới thiệu</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">BNB</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Dịch vụ thực hiện và OTC</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Dữ liệu lịch sử thị trường</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Thông tin giao dịch chuyên sâu</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Bằng chứng Dự trữ</a></li>
          </ul>
        </div>

        {/* Cột 6: Hỗ trợ */}
        <div className="space-y-2.5">
          <h3 className="text-gray-900 dark:text-white text-sm font-semibold mb-4">Hỗ trợ</h3>
          <ul className="space-y-2.5">
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Chat hỗ trợ 24/7</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Trung tâm trợ giúp</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Phản hồi và đề xuất về sản phẩm</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Phí giao dịch</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">API</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Xác minh Binance</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Thông số giao dịch</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Cổng Airdrop Binance</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Yêu cầu Thực thi Pháp luật</a></li>
          </ul>
        </div>

      </div>
    </footer>
  );
};