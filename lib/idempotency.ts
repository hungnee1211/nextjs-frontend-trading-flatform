/**
 * Sinh key duy nhất cho mỗi lần submit nạp/rút.
 * Backend dùng key này để chống trường hợp người dùng bấm nút 2 lần
 * (double-submit) tạo ra 2 giao dịch trùng nhau.
 */
export function generateIdempotencyKey(prefix = 'tx'): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now()}_${random}`;
}