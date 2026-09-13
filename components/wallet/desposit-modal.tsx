'use client';

import { useState } from 'react';
import { Modal } from './modal';
import { Button } from '@/components/ui/button';
import { SUPPORTED_ASSETS } from '@/constants/assets';
import { depositFunds } from '@/lib/api/wallet';
import { generateIdempotencyKey } from '@/lib/idempotency';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function DepositModal({ onClose, onSuccess }: Props) {
  const [asset, setAsset] = useState(SUPPORTED_ASSETS[0]);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    setSubmitting(true);
    try {
      await depositFunds({
        asset,
        amount: amountNum,
        idempotencyKey: generateIdempotencyKey('dep'),
        note: note || undefined,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Nạp tiền thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Nạp tiền (Testnet)" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Tài sản</label>
          <select
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2b313a] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-yellow-500"
          >
            {SUPPORTED_ASSETS.map((sym) => (
              <option key={sym} value={sym}>
                {sym}
              </option>
            ))}
          </select>
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
          {submitting ? 'Đang xử lý...' : 'Xác nhận nạp'}
        </Button>
      </form>
    </Modal>
  );
}