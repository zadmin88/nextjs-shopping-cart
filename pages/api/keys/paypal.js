import { createRouter } from 'next-connect';

const router = createRouter();

router.get(async (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID || 'test' });
});

export default router.handler({});
