import { Buffer } from 'buffer';
import { config } from '../config';

const RETURN_URL =
  process.env.BOT_URL?.trim() || 'https://t.me/n17kamolBot';

/**
 * Click bir martalik to'lov linkini yaratish.
 * Click shop API integer summani talab qiladi, shuning uchun doimiy
 * tarzda butun so'm jo'natiladi.
 */
type ClickLinkOptions = {
  planCode?: string;
};

export function generateClickOnetimeLink(
  userId: string,
  planId: string,
  amount: number,
  options?: ClickLinkOptions,
): string {
  const normalizedAmount = normalizeAmount(amount);
  const planCode = (options?.planCode ?? planId).replace(/\s+/g, '').toLowerCase();
  const userToken = shortenUuid(userId);
  const planToken = shortenUuid(planId);

  const paymentUrl = new URL('https://my.click.uz/services/pay');
  paymentUrl.searchParams.set('service_id', config.CLICK_SERVICE_ID);
  paymentUrl.searchParams.set('merchant_id', config.CLICK_MERCHANT_ID);
  paymentUrl.searchParams.set('amount', normalizedAmount.toString());
  paymentUrl.searchParams.set('transaction_param', userToken);
  paymentUrl.searchParams.set('additional_param3', planToken);
  paymentUrl.searchParams.set('additional_param4', planCode);
  paymentUrl.searchParams.set('return_url', RETURN_URL);

  return paymentUrl.toString();
}

function normalizeAmount(amount: number): number {
  const parsed = Math.floor(Number(amount));
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error('Invalid Click amount');
  }

  return parsed;
}

export function shortenUuid(id: string): string {
  const normalized = id.replace(/-/g, '');
  if (!/^[0-9a-fA-F]{32}$/.test(normalized)) {
    return id;
  }
  const buffer = Buffer.from(normalized, 'hex');
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

export function expandShortUuid(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }
  if (/^[0-9a-fA-F-]{36}$/.test(value)) {
    return value;
  }

  const padded =
    value + Array((4 - (value.length % 4 || 4)) % 4).fill('=').join('');
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  try {
    const buffer = Buffer.from(base64, 'base64');
    const hex = buffer.toString('hex');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(
      12,
      16,
    )}-${hex.slice(16, 20)}-${hex.slice(20)}`.toLowerCase();
  } catch {
    return value;
  }
}
