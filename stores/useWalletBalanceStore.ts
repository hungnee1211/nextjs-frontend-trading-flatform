'use client';

import { fetchUsdPrices, getAssetMeta } from '@/constants/assets';
import { fetchBalances } from '@/lib/api/wallet';
import { AssetDisplay } from '@/types/wallet';
import { useCallback, useEffect, useRef, useState } from 'react';


interface UseWalletBalancesResult {
  assets: AssetDisplay[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Fetch số dư ví, tự huỷ request cũ (AbortController) khi refetch liên tục
 * hoặc khi component unmount — tránh setState trên component đã unmount
 * và tránh lãng phí 1 request đang bay giữa chừng.
 */
export function useWalletBalances(enabled: boolean): UseWalletBalancesResult {
  const [assets, setAssets] = useState<AssetDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const balances = await fetchBalances(controller.signal);
      const symbols = balances.map((b) => b.asset);
      const livePrices = await fetchUsdPrices(symbols);
      
      const display: AssetDisplay[] = balances.map((b) => ({
        ...b,
        ...getAssetMeta(b.asset, livePrices[b.asset]),
      }));
      setAssets(display);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError((err as Error).message || 'Không thể tải số dư ví');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    load();
    return () => controllerRef.current?.abort();
  }, [enabled, load]);

  return { assets, loading, error, refetch: load };
}