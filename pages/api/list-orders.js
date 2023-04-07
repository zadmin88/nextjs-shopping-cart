import { createRouter } from 'next-connect';
import db from '../../utils/db';
import Order from '../../models/Order';

// Default Req and Res are IncomingMessage and ServerResponse
// You may want to pass in NextApiRequest and NextApiResponse
const router = createRouter();

router.get(async (req, res) => {
  await db.connect();
  const orders = await Order.find({});
  await db.disconnect();
  res.send(orders);
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
