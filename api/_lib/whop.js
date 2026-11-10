const ACCOUNT_ID = 'biz_hblp4hQpNX2aym';
const API_VERSION = '2026-11-07';
const BUNDLE_PLAN_ID = 'plan_UZue2BdCxkEbk';

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

export async function retrievePayment(paymentId) {
  const apiKey = process.env.WHOP_API_KEY;
  if (!apiKey) {
    const error = new Error('Payments are temporarily unavailable.');
    error.code = 'CONFIG';
    throw error;
  }

  const response = await fetch(
    `https://api.whop.com/api/v1/payments/${encodeURIComponent(paymentId)}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Api-Version-Date': API_VERSION,
      },
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    const error = new Error('Payment verification failed.');
    error.code = response.status === 404 ? 'NOT_FOUND' : 'UPSTREAM';
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export function downloadsForPayment(payment, requestedSlug) {
  if (payment.account_id !== ACCOUNT_ID) return [];
  if (payment.status !== 'paid') return [];

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
