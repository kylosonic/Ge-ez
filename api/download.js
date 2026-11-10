import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { downloadsForPayment, retrievePayment, setNoStore } from './_lib/whop.js';

export default async function handler(req, res) {
  setNoStore(res);
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ status: 'error', message: 'Method not allowed.' });
  }

  const paymentId = typeof req.query.payment === 'string' ? req.query.payment : '';
  const requestedSlug = typeof req.query.slug === 'string' ? req.query.slug : '';

  if (!/^pay_[A-Za-z0-9]+$/.test(paymentId) || !requestedSlug) {
    return res.status(400).json({ status: 'error', message: 'Invalid download request.' });
  }

  try {
    const payment = await retrievePayment(paymentId);
    const [download] = downloadsForPayment(payment, requestedSlug);

    if (!download) {
      return res.status(403).json({
        status: 'forbidden',
        message: 'This payment does not grant access to this file.',
      });
    }

    const file = await readFile(join(process.cwd(), 'private', 'products', download.filename));
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', file.length);
    res.setHeader('Content-Disposition', `attachment; filename="${download.filename}"`);
    return res.status(200).send(file);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ status: 'error', message: 'Download not found.' });
    }
    if (error.code === 'CONFIG') {
      return res.status(503).json({ status: 'error', message: error.message });
    }
    return res.status(502).json({
      status: 'error',
      message: 'We could not verify the payment for this download.',
    });
  }
}
