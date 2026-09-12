'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, ShieldCheck, Camera, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/useAuthStore';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isInitialized } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Chưa đăng nhập -> đá về login
  useEffect(() => {
    if (mounted && isInitialized && !user) {
      router.push('/login');
    }
  }, [mounted, isInitialized, user, router]);

  if (!mounted || !isInitialized) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10 animate-pulse">
        <div className="h-24 bg-gray-100 dark:bg-[#2b313a] rounded-lg mb-6" />
        <div className="h-40 bg-gray-100 dark:bg-[#2b313a] rounded-lg" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Tài khoản của tôi</h1>

      {/* Card thông tin cơ bản */}
      <div className="bg-white dark:bg-[#1e2329] border border-gray-100 dark:border-[#2b313a] rounded-lg p-6 flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || 'User'}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-[#2b313a] flex items-center justify-center">
                <User className="w-7 h-7 text-gray-500 dark:text-gray-300" />
              </div>
            )}
            <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#F0B90B] flex items-center justify-center">
              <Camera className="w-3.5 h-3.5 text-black" />
            </button>
          </div>
          <div>
            <div className="text-lg font-semibold">{user.name || 'Chưa đặt tên'}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> {user.email}
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5 rounded-lg border-gray-200 dark:border-[#2b313a]"
        >
          <Pencil className="w-3.5 h-3.5" />
          Chỉnh sửa
        </Button>
      </div>

      {/* Card cấp độ bảo mật */}
      <div className="bg-white dark:bg-[#1e2329] border border-gray-100 dark:border-[#2b313a] rounded-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-[#F0B90B]" />
          <span className="font-semibold">Bảo mật tài khoản</span>
        </div>
        <div className="space-y-3 text-sm">
          <SecurityRow label="Xác thực Email" value={user.email} verified />
          <SecurityRow label="Xác thực 2 lớp (2FA)" value="Chưa bật" verified={false} />
          <SecurityRow label="Mật khẩu" value="••••••••" verified />
        </div>
      </div>

      {/* Thông tin tài khoản */}
      <div className="bg-white dark:bg-[#1e2329] border border-gray-100 dark:border-[#2b313a] rounded-lg p-6">
        <div className="font-semibold mb-4">Thông tin tài khoản</div>
        <dl className="grid grid-cols-2 gap-y-4 text-sm">
          <dt className="text-gray-500 dark:text-gray-400">Họ tên</dt>
          <dd>{user.name || '—'}</dd>
          <dt className="text-gray-500 dark:text-gray-400">Email</dt>
          <dd>{user.email}</dd>
          <dt className="text-gray-500 dark:text-gray-400">Mã UID</dt>
          <dd>{user.id ?? '—'}</dd>
        </dl>
      </div>
    </div>
  );
}

function SecurityRow({
  label,
  value,
  verified,
}: {
  label: string;
  value?: string;
  verified: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-[#2b313a] last:border-0">
      <div>
        <div className="text-gray-900 dark:text-white">{label}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{value}</div>
      </div>
      <span
        className={`text-xs font-medium px-2 py-0.5 rounded ${
          verified
            ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'
            : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400'
        }`}
      >
        {verified ? 'Đã xác thực' : 'Chưa bật'}
      </span>
    </div>
  );
}