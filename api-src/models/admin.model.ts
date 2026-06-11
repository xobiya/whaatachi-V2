import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema) as any;

const ADMIN_USERNAME = 'admin';

export async function findOrCreateAdmin(passcode: string): Promise<{ id: string; username: string; password: string; createdAt: string }> {
  let admin = await Admin.findOne({ username: ADMIN_USERNAME });
  if (!admin) {
    const hashed = await bcrypt.hash(passcode, 10);
    admin = await Admin.create({ username: ADMIN_USERNAME, password: hashed });
  } else {
    const storedMatch = await bcrypt.compare(passcode, admin.password);
    if (!storedMatch) {
      const hashed = await bcrypt.hash(passcode, 10);
      admin = await Admin.findOneAndUpdate(
        { username: ADMIN_USERNAME },
        { $set: { password: hashed } },
        { new: true }
      );
    }
  }
  return {
    id: String(admin._id),
    username: admin.username,
    password: admin.password,
    createdAt: admin.createdAt.toISOString(),
  };
}

export async function verifyAdminPasscode(passcode: string): Promise<{ id: string; username: string; password: string; createdAt: string } | null> {
  const admin = await Admin.findOne({ username: ADMIN_USERNAME });
  if (!admin) return null;
  const match = await bcrypt.compare(passcode, admin.password);
  if (!match) return null;
  return {
    id: String(admin._id),
    username: admin.username,
    password: admin.password,
    createdAt: admin.createdAt.toISOString(),
  };
}

export async function updateAdminPasscode(newPasscode: string): Promise<void> {
  const hashed = await bcrypt.hash(newPasscode, 10);
  await Admin.findOneAndUpdate({ username: ADMIN_USERNAME }, { $set: { password: hashed } });
}

export default Admin;
