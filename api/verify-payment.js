import { downloadsForPayment, retrievePayment, setNoStore } from './_lib/whop.js';

export default async function handler(req, res) {
  setNoStore(res);
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ status: 'error', message: 'Method not allowed.' });
  }

  const paymentId = typeof req.query.payment === 'string' ? req.query.payment : '';
  const requestedSlug = typeof req.query.product === 'string' ? req.query.product : '';

  if (!/^pay_[A-Za-z0-9]+$/.test(paymentId)) {
    return res.status(400).json({ status: 'error', message: 'Invalid payment reference.' });
  }

  try {
    const payment = await retrievePayment(paymentId);
    const downloads = downloadsForPayment(payment, requestedSlug);

    if (payment.status === 'open' || payment.status === 'pending') {
      return res.status(409).json({
        status: payment.status,
        message: 'Whop is still confirming this payment.',
      });
    }

    if (payment.status !== 'paid') {
      return res.status(402).json({
        status: payment.status,
        message: 'This payment was not completed.',
      });
    }

    if (downloads.length === 0) {
      return res.status(403).json({
        status: 'forbidden',
        message: 'This payment does not grant access to the requested download.',
      });
    }

    return res.status(200).json({
      status: 'paid',
      downloads,
    });
  } catch (error) {
    if (error.code === 'CONFIG') {
      return res.status(503).json({ status: 'error', message: error.message });
    }
    return res.status(502).json({
      status: 'error',
      message: 'Whop could not verify the payment. Please try again.',
    });
  }
}
