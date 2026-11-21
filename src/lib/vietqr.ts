export interface VietQrParams {
  bankId: string;
  accountNo: string;
  accountName: string;
  amount: number;
  memo: string;
  template?: string; // 'compact2' | 'compact' | 'qr_only' | 'print'
}

export function generateVietQrUrl({
  bankId,
  accountNo,
  accountName,
  amount,
  memo,
  template = 'compact2',
}: VietQrParams): string {
  const cleanBank = bankId.trim().toUpperCase();
  const cleanAccount = accountNo.trim().replace(/\s+/g, '');
  const cleanName = encodeURIComponent(accountName.trim().toUpperCase());
  const cleanMemo = encodeURIComponent(memo.trim());
  const cleanAmount = Math.max(0, Math.round(amount));

  return `https://img.vietqr.io/image/${cleanBank}-${cleanAccount}-${template}.png?amount=${cleanAmount}&addInfo=${cleanMemo}&accountName=${cleanName}`;
}

export const POPULAR_BANKS = [
  { id: 'MB', name: 'MBBank (Ngân hàng Quân Đội)' },
  { id: 'VCB', name: 'Vietcombank' },
  { id: 'TCB', name: 'Techcombank' },
  { id: 'ACB', name: 'ACB (Á Châu)' },
  { id: 'BIDV', name: 'BIDV' },
  { id: 'VIB', name: 'VIB' },
  { id: 'TPB', name: 'TPBank' },
  { id: 'VPB', name: 'VPBank' },
  { id: 'STB', name: 'Sacombank' },
  { id: 'HDB', name: 'HDBank' },
  { id: 'VIETINBANK', name: 'VietinBank' },
];

