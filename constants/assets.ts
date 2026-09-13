import type { AssetMeta } from '@/types/wallet';

interface CoinGeckoPriceResponse {
  [key: string]: {
    usd: number;
  };
}

const COINGECKO_ID_MAP: Record<string, string> = {
  USDT: 'tether',
  BTC: 'bitcoin',
  ETH: 'ethereum',
  BNB: 'binancecoin',
};

let priceCache: Record<string, number> = {};
let cacheTimestamp = 0;
const CACHE_DURATION = 60_000; // 1 phút cache

/**
 * Lấy giá USD mới nhất từ CoinGecko (free public API, không cần API key).
 * Có cache 1 phút để tránh rate limit.
 */
export async function fetchUsdPrices(symbols: string[]): Promise<Record<string, number>> {
  const now = Date.now();
  if (now - cacheTimestamp < CACHE_DURATION && Object.keys(priceCache).length > 0) {
    return priceCache;
  }

  const ids = symbols
    .map((s) => COINGECKO_ID_MAP[s])
    .filter(Boolean)
    .join(',');

  if (!ids) return {};

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error('CoinGecko fetch failed');

    const data: CoinGeckoPriceResponse = await res.json();

    priceCache = {};
    for (const [symbol, id] of Object.entries(COINGECKO_ID_MAP)) {
      if (data[id]) {
        priceCache[symbol] = data[id].usd;
      }
    }
    cacheTimestamp = now;
    return priceCache;
  } catch (err) {
    console.error('Failed to fetch USD prices:', err);
    // Trả về giá cũ nếu có, hoặc fallback mock
    return priceCache;
  }
}

/**
 * Giá fallback mock cho testnet/khi API lỗi.
 */
const FALLBACK_PRICES: Record<string, number> = {
  USDT: 1,
  BTC: 65000,
  ETH: 3400,
  BNB: 580,
};

export const ASSET_META: Record<string, AssetMeta> = {
  USDT: { name: 'TetherUS', icon: 'USDT', usdPrice: FALLBACK_PRICES.USDT },
  BTC: { name: 'Bitcoin', icon: 'BTC', usdPrice: FALLBACK_PRICES.BTC },
  ETH: { name: 'Ethereum', icon: 'ETH', usdPrice: FALLBACK_PRICES.ETH },
  BNB: { name: 'BNB', icon: 'BNB', usdPrice: FALLBACK_PRICES.BNB },
};

export function getAssetMeta(symbol: string, usdPriceOverride?: number): AssetMeta {
  const meta = ASSET_META[symbol];
  if (meta && usdPriceOverride != null) {
    return { ...meta, usdPrice: usdPriceOverride };
  }
  return (
    meta ?? {
      name: symbol,
      icon: symbol.slice(0, 3),
      usdPrice: FALLBACK_PRICES[symbol] ?? 0,
    }
  );
}

export const SUPPORTED_ASSETS = Object.keys(ASSET_META);