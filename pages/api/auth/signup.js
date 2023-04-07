import db from '../../../utils/db';
import User from '../../../models/User';
import { hashPassword } from '../../../utils/auth';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const data = req.body;

  const { name, email, password } = data;

  if (
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 7
  ) {
    res.status(422).json({
      message: 'invalid input',
    });
    return;
  }

  await db.connect();

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    res.status(422).json({ message: 'User already exist' });
    db.disconnect();
    return;
  }

  const hashedPassword = await hashPassword(password);

  const result = await User.create({
    email: email,
    password: hashedPassword,
    name: name,
  });

  res.status(201).json({ message: 'user has been created!' });
  await db.disconnect();
}

export default handler;
