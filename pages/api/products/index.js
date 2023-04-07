// pages/api/hello.js

import { createRouter } from 'next-connect';
import db from '../../../utils/db';

import Product from '../../../models/Product';

// Default Req and Res are IncomingMessage and ServerResponse
// You may want to pass in NextApiRequest and NextApiResponse
const router = createRouter();

router.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect(products);
  res.send(products);
});

// create a handler from router with custom
// onError and onNoMatch
export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(500).end('Something broke!');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
});
