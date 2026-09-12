import { create } from 'zustand';

/**
 * Store này CHỈ chứa những state thực sự cần chia sẻ giữa nhiều khu vực
 * của màn hình giao dịch (Sổ lệnh, Biểu đồ, Form đặt lệnh, Danh sách coin...).
 *
 * Những state chỉ dùng nội bộ trong 1 khu vực (sổ lệnh bids/asks, lịch sử
 * giao dịch, giá trị đang gõ trong ô input...) KHÔNG nên đưa vào đây.
 * Lý do: các WebSocket đó bắn dữ liệu rất nhanh (chục lần/giây). Nếu để
 * global, MỌI component đang subscribe store sẽ re-render theo, kể cả ô
 * input người dùng đang gõ dở. Để state đó là useState cục bộ trong đúng
 * component cần nó sẽ tối ưu hơn nhiều so với nhét hết vào Zustand.
 */

export interface Ticker24hr {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  volume: string;
}

interface CryptoState {
  selectedSymbol: string;
  tickerData: Ticker24hr | null;

  setSelectedSymbol: (symbol: string) => void;
  setTickerData: (data: Ticker24hr | null) => void;
}

export const useCryptoStore = create<CryptoState>((set) => ({
  selectedSymbol: 'BTCUSDT',
  tickerData: null,

  setSelectedSymbol: (symbol) =>
    // Reset tickerData ngay khi đổi coin để tránh hiển thị nhầm giá của coin cũ
    // trong lúc chờ API/WebSocket của coin mới trả dữ liệu.
    set({ selectedSymbol: symbol, tickerData: null }),

  setTickerData: (data) => set({ tickerData: data }),
}));

/**
 * Selector tiện dụng: chỉ re-render khi phần "mã coin gốc" (BTC, ETH...)
 * thực sự thay đổi, thay vì mỗi khi cả object tickerData đổi.
 */
export const useBaseAsset = (): string =>
  useCryptoStore((state) => state.selectedSymbol.replace('USDT', ''));