const ACCOUNT_ID = 'biz_hblp4hQpNX2aym';
const API_VERSION = '2026-11-07';
const BUNDLE_PLAN_ID = 'plan_UZue2BdCxkEbk';
const FULLY_REFUNDED_SUBSTATUSES = new Set(['refunded', 'auto_refunded']);

export const PRODUCTS = [
  {
    slug: '01-first-500-dollars-online',
    name: 'The First $500 Online',
    filename: '01-first-500-dollars-online.pdf',
    planId: 'plan_MJMp9M0Td50KT',
  },
  {
    slug: '02-freelancer-starter-system',
    name: 'Freelancer Starter System',
    filename: '02-freelancer-starter-system.pdf',
    planId: 'plan_6wiyM84r7nb0P',
  },
  {
    slug: '03-ai-income-system',
    name: 'AI Income System',
    filename: '03-ai-income-system.pdf',
    planId: 'plan_cgqdR7zthtsoy',
  },
  {
    slug: '04-social-media-manager-starter',
    name: 'Social Media Manager Starter',
    filename: '04-social-media-manager-starter.pdf',
    planId: 'plan_IQfCapPnHIiZT',
  },
  {
    slug: '05-canva-to-cash',
    name: 'Canva to Cash',
    filename: '05-canva-to-cash.pdf',
    planId: 'plan_mYpgqOwPDVAbF',
  },
  {
    slug: '06-sell-digital-products',
    name: 'Sell Digital Products',
    filename: '06-sell-digital-products.pdf',
    planId: 'plan_cHL65aVUaGpXV',
  },
  {
    slug: '07-remote-work-starter',
    name: 'Remote Work Starter',
    filename: '07-remote-work-starter.pdf',
    planId: 'plan_vsBhCoAtrR0rL',
  },
  {
    slug: '08-content-income-system',
    name: 'Content Income System',
    filename: '08-content-income-system.pdf',
    planId: 'plan_L3ciCOPVvQQjx',
  },
  {
    slug: '09-online-service-business',
    name: 'Online Service Business',
    filename: '09-online-service-business.pdf',
    planId: 'plan_wnz6ZU0COcjUH',
  },
  {
    slug: '10-digital-business-challenge',
    name: 'Digital Business Challenge',
    filename: '10-digital-business-challenge.pdf',
    planId: 'plan_LpGCW7Fv8xqpu',
  },
];

export const PRODUCT_BY_SLUG = new Map(PRODUCTS.map((product) => [product.slug, product]));
export const BUNDLE = {
  slug: 'complete-library',
  name: 'The Complete Library',
  planId: BUNDLE_PLAN_ID,
};

function apiKey() {
  const value = process.env.WHOP_API_KEY;
  if (!value) {
    const error = new Error('Payments are temporarily unavailable.');
    error.code = 'CONFIG';
    throw error;
  }
  return value;
}

async function whopRequest(path) {
  const response = await fetch(`https://api.whop.com/api/v1/${path}`, {
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      'Api-Version-Date': API_VERSION,
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    const error = new Error('Whop request failed.');
    error.code =
      response.status === 404
        ? 'NOT_FOUND'
        : response.status === 403
          ? 'PERMISSION'
          : 'UPSTREAM';
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export async function retrievePayment(paymentId) {
  return whopRequest(`payments/${encodeURIComponent(paymentId)}`);
}

export async function listPaidPaymentsByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    const error = new Error('A valid email is required.');
    error.code = 'INPUT';
    throw error;
  }

  const payments = [];
  let cursor = null;

  for (let page = 0; page < 10; page += 1) {
    const params = new URLSearchParams({
      account_id: ACCOUNT_ID,
      query: normalizedEmail,
      status: 'paid',
      first: '100',
    });
    if (cursor) params.set('after', cursor);

    const response = await whopRequest(`payments?${params}`);
    const pagePayments = Array.isArray(response.data) ? response.data : [];
    payments.push(
      ...pagePayments.filter(
        (payment) =>
          payment.account_id === ACCOUNT_ID &&
          normalizeEmail(payment.customer_email) === normalizedEmail,
      ),
    );

    cursor = response.page_info?.end_cursor;
    if (!response.page_info?.has_next_page || !cursor) break;
    if (page === 9) {
      const error = new Error('Too many payments to verify.');
      error.code = 'PAGINATION';
      throw error;
    }
  }

  return payments;
}

export function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

export function paymentStillGrantsAccess(payment) {
  const refundedAmount = Number(payment?.refunded_amount?.amount);
  const presentmentRefundedAmount = Number(
    payment?.presentment_refunded_amount?.amount,
  );
  const total = Number(payment?.total?.amount);
  const presentmentTotal = Number(payment?.presentment_total?.amount);
  const fullyRefunded =
    (Number.isFinite(refundedAmount) &&
      Number.isFinite(total) &&
      total > 0 &&
      refundedAmount >= total) ||
    (Number.isFinite(presentmentRefundedAmount) &&
      Number.isFinite(presentmentTotal) &&
      presentmentTotal > 0 &&
      presentmentRefundedAmount >= presentmentTotal);

  return (
    payment?.account_id === ACCOUNT_ID &&
    payment.status === 'paid' &&
    !payment.auto_refunded &&
    !FULLY_REFUNDED_SUBSTATUSES.has(payment.substatus) &&
    !fullyRefunded
  );
}

export function findBlockingPurchase(payments, requestedPlanId) {
  const activePayments = payments.filter(paymentStillGrantsAccess);
  const requestedProduct =
    requestedPlanId === BUNDLE_PLAN_ID
      ? BUNDLE
      : PRODUCTS.find((product) => product.planId === requestedPlanId);

  if (!requestedProduct) return null;

  if (requestedPlanId === BUNDLE_PLAN_ID) {
    return activePayments.some((payment) => payment.variant_id === BUNDLE_PLAN_ID)
      ? { kind: 'bundle', name: BUNDLE.name }
      : null;
  }

  if (activePayments.some((payment) => payment.variant_id === requestedPlanId)) {
    return { kind: 'course', name: requestedProduct.name };
  }

  if (activePayments.some((payment) => payment.variant_id === BUNDLE_PLAN_ID)) {
    return { kind: 'bundle', name: BUNDLE.name };
  }

  return null;
}

export function downloadsForPayment(payment, requestedSlug) {
  if (payment.account_id !== ACCOUNT_ID) return [];
  if (!paymentStillGrantsAccess(payment)) return [];

  if (payment.variant_id === BUNDLE_PLAN_ID) {
    if (requestedSlug) {
      const requestedProduct = PRODUCT_BY_SLUG.get(requestedSlug);
      return requestedProduct ? [requestedProduct] : [];
    }
    return PRODUCTS;
  }

  const product = PRODUCTS.find((entry) => entry.planId === payment.variant_id);
  if (!product) return [];
  if (requestedSlug && requestedSlug !== product.slug) return [];
  return [product];
}

export function setNoStore(res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}
