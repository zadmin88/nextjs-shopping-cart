import { createRouter } from 'next-connect';
import db from '../../../utils/db';
import Order from '../../../models/Order';

const router = createRouter();

router.post(async (req, res) => {
  try {
    await db.connect();
    const newOrder = new Order({
      ...req.body,
      user: req.body.user_id,
    });
    const order = await newOrder.save();
    res.send({ message: 'Order saved', data: order });
    await db.disconnect();
  } catch (err) {
    res.send({ message: err });
  }
});

export default router.handler({});
