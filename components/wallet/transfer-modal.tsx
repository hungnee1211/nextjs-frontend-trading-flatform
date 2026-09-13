'use client';

import { useMemo, useState } from 'react';
import { Modal } from './modal';
import { Button } from '@/components/ui/button';
import { transferFunds } from '@/lib/api/wallet';
import { generateIdempotencyKey } from '@/lib/idempotency';
import type { AssetDisplay } from '@/types/wallet';

interface Props {
  assets: AssetDisplay[];
  onClose: () => void;
  onSuccess: (balances?: AssetDisplay[]) => void;
}

export default function TransferModal({ assets, onClose, onSuccess }: Props) {
  // Lọc các asset có số dư > 0 trong ít nhất 1 wallet type
  const transferable = useMemo(() => {
    // Lọc asset có total > 0, rồi unique theo asset (hiển thị 1 lần mỗi asset)
    const seen = new Set<string>();
    return assets
      .filter((a) => a.total > 0)
      .filter((a) => {
        if (seen.has(a.asset)) return false;
        seen.add(a.asset);
        return true;
      });
  }, [assets]);

  const [asset, setAsset] = useState(transferable[0]?.asset ?? '');
  const [amount, setAmount] = useState('');
  const [fromWalletType, setFromWalletType] = useState<'SPOT' | 'FUNDING'>('SPOT');
  const [toWalletType, setToWalletType] = useState<'SPOT' | 'FUNDING'>('FUNDING');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedAsset = assets.find((a) => a.asset === asset);
  
  // Tìm available balance cho từng wallet type
  const spotAsset = assets.find((a) => a.asset === asset && a.walletType === 'SPOT');
  const fundingAsset = assets.find((a) => a.asset === asset && a.walletType === 'FUNDING');
  const spotAvailable = spotAsset?.available ?? 0;
  const fundingAvailable = fundingAsset?.available ?? 0;

  const fromAvailable = fromWalletType === 'SPOT' ? spotAvailable : fundingAvailable;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ');
      return;
    }
    if (fromAvailable < amountNum) {
      setError(`Số dư ${fromWalletType} không đủ để chuyển`);
      return;
    }

    setSubmitting(true);
    try {
      const result = await transferFunds({
        asset,
        amount: amountNum,
        fromWalletType,
        toWalletType,
        idempotencyKey: generateIdempotencyKey('trf'),
        note: note || undefined,
      });
      onSuccess(result.balances);
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Chuyển tiền thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const swapWallets = () => {
    const temp = fromWalletType;
    setFromWalletType(toWalletType);
    setToWalletType(temp);
  };

  if (transferable.length === 0) {
    return (
      <Modal title="Chuyển tiền (Testnet)" onClose={onClose}>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Bạn chưa có số dư để chuyển. Hãy nạp tiền trước.
        </p>
      </Modal>
    );
  }

  return (
    <Modal title="Chuyển tiền (Testnet)" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Tài sản</label>
          <select
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2b313a] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-yellow-500"
          >
            {transferable.map((a) => (
              <option key={a.asset} value={a.asset}>
                {a.asset} — Tổng {a.total}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Từ ví</label>
            <select
              value={fromWalletType}
              onChange={(e) => setFromWalletType(e.target.value as 'SPOT' | 'FUNDING')}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2b313a] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-yellow-500"
            >
              <option value="SPOT">Spot</option>
              <option value="FUNDING">Funding</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Khả dụng: {fromWalletType === 'SPOT' ? spotAvailable : fundingAvailable} {asset}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={swapWallets}
            className="h-10 px-2 text-sm flex-shrink-0 self-end mb-2"
            disabled={submitting}
          >
            ↔
          </Button>

          <div className="flex-1">
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Đến ví</label>
            <select
              value={toWalletType}
              onChange={(e) => setToWalletType(e.target.value as 'SPOT' | 'FUNDING')}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2b313a] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-yellow-500"
            >
              <option value="SPOT">Spot</option>
              <option value="FUNDING">Funding</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Hiện có: {toWalletType === 'SPOT' ? spotAvailable : fundingAvailable} {asset}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Số lượng</label>
          <input
            type="number"
            step="any"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2b313a] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-yellow-500"
          />
          {selectedAsset && (
            <p className="text-xs text-gray-400 mt-1">
              Tổng: {selectedAsset.total} {selectedAsset.asset} (Spot: {spotAvailable} / Funding: {fundingAvailable})
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Ghi chú (tuỳ chọn)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2b313a] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-yellow-500"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <p className="text-xs text-gray-400">
          Đây là giao dịch mô phỏng trên môi trường testnet, không phải tiền thật.
        </p>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
        >
          {submitting ? 'Đang xử lý...' : 'Xác nhận chuyển'}
        </Button>
      </form>
    </Modal>
  );
}