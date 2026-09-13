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

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Headers cho API requests. Dự án dùng cookie httpOnly (credentials: 'include')
 * nên không cần Authorization header. Chỉ cần Content-Type.
 */
function buildHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
  };
}

async function unwrap<T>(res: Response): Promise<T> {
  let json: ApiResponse<T> | null = null;
  try {
    json = await res.json();
  } catch {
    // response không phải JSON hợp lệ
  }

  if (!res.ok || !json || json.success === false) {
    const message = json?.message || `Yêu cầu thất bại (${res.status})`;
    throw new Error(message);
  }

  return json.data;
}

export async function fetchBalances(signal?: AbortSignal): Promise<WalletBalance[]> {
  const res = await fetch(`${API_URL}/api/wallet/balance`, {
    method: 'GET',
    credentials: 'include',
    headers: buildHeaders(),
    signal,
  });
  return unwrap<WalletBalance[]>(res);
}

export async function fetchTransactions(
  params: { page?: number; limit?: number; type?: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER_IN' | 'TRANSFER_OUT'; asset?: string } = {},
  signal?: AbortSignal
): Promise<TransactionListResult> {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.type) qs.set('type', params.type);
  if (params.asset) qs.set('asset', params.asset);

  const res = await fetch(`${API_URL}/api/wallet/transactions?${qs.toString()}`, {
    method: 'GET',
    credentials: 'include',
    headers: buildHeaders(),
    signal,
  });
  return unwrap<TransactionListResult>(res);
}

export async function depositFunds(payload: DepositPayload): Promise<Transaction> {
  const res = await fetch(`${API_URL}/api/wallet/deposit`, {
    method: 'POST',
    credentials: 'include',
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });
  return unwrap<Transaction>(res);
}

export async function withdrawFunds(payload: WithdrawPayload): Promise<Transaction> {
  const res = await fetch(`${API_URL}/api/wallet/withdraw`, {
    method: 'POST',
    credentials: 'include',
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });
  return unwrap<Transaction>(res);
}

export async function transferFunds(payload: TransferPayload): Promise<TransferResult> {
  const res = await fetch(`${API_URL}/api/wallet/transfer`, {
    method: 'POST',
    credentials: 'include',
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });
  return unwrap<TransferResult>(res);
}