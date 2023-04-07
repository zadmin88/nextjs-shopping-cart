import { createRouter } from 'next-connect';
import db from '../../../utils/db';
import User from '../../../models/User';

const router = createRouter();

router.put(async (req, res) => {
  const { id, role } = req.body;
  await db.connect();
  const user = await User.findById(id);
  if (user && role === 'admin') {
    user.isAdmin = true;
  }
  await user.save();
  await db.disconnect();
  res.sendDate({ message: 'user updated' });
});

// create a handler from router with custom
// onError and onNoMatch
export default router.handler({});
