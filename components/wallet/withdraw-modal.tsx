'use client';

import { useMemo, useState } from 'react';
import { Modal } from './modal';
import { Button } from '@/components/ui/button';
import { withdrawFunds } from '@/lib/api/wallet';
import { generateIdempotencyKey } from '@/lib/idempotency';
import { AssetDisplay } from '@/types/wallet';


interface Props {
  assets: AssetDisplay[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function WithdrawModal({ assets, onClose, onSuccess }: Props) {
  const withdrawable = useMemo(() => assets.filter((a) => a.available > 0), [assets]);

  const [asset, setAsset] = useState(withdrawable[0]?.asset ?? '');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedAsset = assets.find((a) => a.asset === asset);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ');
      return;
    }
    if (selectedAsset && amountNum > selectedAsset.available) {
      setError('Số dư khả dụng không đủ');
      return;
    }

    setSubmitting(true);
    try {
      await withdrawFunds({
        asset,
        amount: amountNum,
        address: address || undefined,
        idempotencyKey: generateIdempotencyKey('wd'),
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Rút tiền thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  if (withdrawable.length === 0) {
    return (
      <Modal title="Rút tiền (Testnet)" onClose={onClose}>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Bạn chưa có số dư khả dụng để rút. Hãy nạp tiền trước.
        </p>
      </Modal>
    );
  }

  return (
    <Modal title="Rút tiền (Testnet)" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Tài sản</label>
          <select
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2b313a] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-yellow-500"
          >
            {withdrawable.map((a) => (
              <option key={a.asset} value={a.asset}>
                {a.asset} — khả dụng {a.available}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
            Địa chỉ nhận (testnet)
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Địa chỉ ví testnet"
            className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2b313a] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-yellow-500"
          />
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
              Khả dụng: {selectedAsset.available} {selectedAsset.asset}
            </p>
          )}
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
          {submitting ? 'Đang xử lý...' : 'Xác nhận rút'}
        </Button>
      </form>
    </Modal>
  );
}