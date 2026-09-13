// Kiểu dữ liệu khớp với response từ backend testnet-wallet (controllers/walletController.js)

export interface WalletBalance {
  asset: string;
  available: number;
  locked: number;
  total: number;
  isTestnet?: boolean;
  walletType?: 'SPOT' | 'FUNDING';
}

export interface AssetMeta {
  name: string;
  icon: string;
  usdPrice: number;
}

// Dữ liệu đã merge giữa số dư thật (BE) và metadata hiển thị (FE)
export interface AssetDisplay extends WalletBalance, AssetMeta {}

export type TransactionType = 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER_IN' | 'TRANSFER_OUT';
export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

export interface Transaction {
  _id: string;
  asset: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  network: string;
  address?: string;
  note?: string;
  balanceAfter?: number;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface TransactionListResult {
  items: Transaction[];
  pagination: Pagination;
}

export interface DepositPayload {
  asset: string;
  amount: number;
  idempotencyKey: string;
  note?: string;
}

export interface WithdrawPayload extends DepositPayload {
  address?: string;
}

export interface TransferPayload {
  asset: string;
  amount: number;
  fromWalletType: 'SPOT' | 'FUNDING';
  toWalletType: 'SPOT' | 'FUNDING';
  idempotencyKey: string;
  note?: string;
}

export interface TransferResult {
  transferOut: Transaction;
  transferIn: Transaction;
  balances: AssetDisplay[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}