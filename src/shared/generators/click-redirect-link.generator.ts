import { createHash } from 'crypto';
import { config } from '../config';
export type ClickRedirectParams = {
  amount: number;
  planId: string;
  userId: string;
};
const CLICK_URL = `https://my.click.uz`;
const BOT_URL = 'https://t.me/n17kamolBot';

function buildMerchantTransactionId(params: ClickRedirectParams): string {
  return `${params.userId}.${params.planId}`;
}

export function buildClickProviderUrl(params: ClickRedirectParams): string {
  const serviceId = config.CLICK_SERVICE_ID;
  const merchantId = config.CLICK_MERCHANT_ID;
  const merchantTransId = buildMerchantTransactionId(params);

  // amount har doim integer bo'lishi kerak
  const intAmount = Math.floor(Number(params.amount));
  const transactionParam = normalizeParam(params.userId, 'usr');
  const planParam = normalizeParam(params.planId, 'pln');
  return `${CLICK_URL}/services/pay?service_id=${serviceId}&merchant_id=${merchantId}&amount=${intAmount}&transaction_param=${transactionParam}&additional_param3=${planParam}&additional_param4=${planParam}&return_url=${BOT_URL}`;
}

export function getClickRedirectLink(params: ClickRedirectParams) {
  return buildClickProviderUrl(params);
}

function normalizeParam(value: string | undefined, prefix: string): string {
  const raw = value?.replace(/[^a-zA-Z0-9]/g, '') ?? '';
  const base = raw || prefix;
  if (base.length === 24) {
    return base;
  }

  if (base.length > 24) {
    return base.slice(0, 24);
  }

  const hash = createHash('md5').update(base).digest('hex');
  return (base + hash).slice(0, 24);
}
