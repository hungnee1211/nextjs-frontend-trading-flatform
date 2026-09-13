import { api } from '@/lib/axios';
import type {
  ApiResponse,
  DepositPayload,
  Transaction,
  TransactionListResult,
  TransferPayload,
  TransferResult,
  WalletBalance,
  WithdrawPayload,
} from '@/types/wallet';

/**
 * Extract data from axios response, handling error format
 */
function unwrap<T>(response: { data: ApiResponse<T> }): T {
  const json = response.data;
  if (!json || json.success === false) {
    throw new Error(json?.message || 'Yêu cầu thất bại');
  }
  return json.data;
}

export async function fetchBalances(signal?: AbortSignal): Promise<WalletBalance[]> {
  const response = await api.get<ApiResponse<WalletBalance[]>>('/api/wallet/balance', { signal });
  return unwrap<WalletBalance[]>(response);
}

export async function fetchTransactions(
  params: { page?: number; limit?: number; type?: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER_IN' | 'TRANSFER_OUT'; asset?: string } = {},
  signal?: AbortSignal
): Promise<TransactionListResult> {
  const response = await api.get<ApiResponse<TransactionListResult>>('/api/wallet/transactions', { params, signal });
  return unwrap<TransactionListResult>(response);
}

export async function depositFunds(payload: DepositPayload): Promise<Transaction> {
  const response = await api.post<ApiResponse<Transaction>>('/api/wallet/deposit', payload);
  return unwrap<Transaction>(response);
}

export async function withdrawFunds(payload: WithdrawPayload): Promise<Transaction> {
  const response = await api.post<ApiResponse<Transaction>>('/api/wallet/withdraw', payload);
  return unwrap<Transaction>(response);
}

export async function transferFunds(payload: TransferPayload): Promise<TransferResult> {
  const response = await api.post<ApiResponse<TransferResult>>('/api/wallet/transfer', payload);
  return unwrap<TransferResult>(response);
}