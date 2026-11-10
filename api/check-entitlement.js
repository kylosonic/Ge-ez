import {
  BUNDLE,
  findBlockingPurchase,
  listPaidPaymentsByEmail,
  normalizeEmail,
  PRODUCTS,
  setNoStore,
} from './_lib/whop.js';

const VALID_PLAN_IDS = new Set([...PRODUCTS, BUNDLE].map((product) => product.planId));

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body !== 'string') return {};
  try {
    return JSON.parse(req.body);
  } catch {
    return {};
  }
}

function isValidEmail(email) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isSameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;

  try {
    const host = String(req.headers['x-forwarded-host'] || req.headers.host || '')
      .split(',')[0]
      .trim();
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  setNoStore(res);
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ status: 'error', message: 'Method not allowed.' });
  }

  if (!isSameOrigin(req)) {
    return res.status(403).json({ status: 'error', message: 'Request not allowed.' });
  }

  const body = readBody(req);
  const email = normalizeEmail(body.email);
  const planId = typeof body.planId === 'string' ? body.planId : '';

  if (!isValidEmail(email)) {
    return res.status(400).json({
      status: 'error',
      message: 'Enter a valid email address.',
    });
  }

  if (!VALID_PLAN_IDS.has(planId)) {
    return res.status(400).json({
      status: 'error',
      message: 'This product is not available for checkout.',
    });
  }

  try {
    const payments = await listPaidPaymentsByEmail(email);
    const blockingPurchase = findBlockingPurchase(payments, planId);

    if (blockingPurchase) {
      return res.status(409).json({
        status: 'owned',
        message:
          blockingPurchase.kind === 'bundle'
            ? 'This email already owns The Complete Library, which includes this guide.'
            : 'This email has already purchased this guide.',
      });
    }

    return res.status(200).json({
      status: 'allowed',
      email,
    });
  } catch (error) {
    if (error.code === 'CONFIG' || error.code === 'PERMISSION') {
      return res.status(503).json({
        status: 'error',
        message: 'We could not check this email right now. Please try again shortly.',
      });
    }

    return res.status(502).json({
      status: 'error',
      message: 'We could not check this email right now. Please try again.',
    });
  }
}
