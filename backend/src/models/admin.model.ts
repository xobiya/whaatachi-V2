import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

const ADMIN_USERNAME = 'admin';

export async function findOrCreateAdmin(passcode: string) {
  let admin = await prisma.admin.findUnique({ where: { username: ADMIN_USERNAME } });

  if (!admin) {
    const hashed = await bcrypt.hash(passcode, 10);
    admin = await prisma.admin.create({
      data: { username: ADMIN_USERNAME, password: hashed },
    });
  } else {
    const storedMatch = await bcrypt.compare(passcode, admin.password);
    if (!storedMatch) {
      const hashed = await bcrypt.hash(passcode, 10);
      admin = await prisma.admin.update({
        where: { id: admin.id },
        data: { password: hashed },
      });
    }
  }

  return {
    id: String(admin.id),
    username: admin.username,
    password: admin.password,
    createdAt: admin.createdAt.toISOString(),
  };
}

export async function verifyAdminPasscode(passcode: string) {
  const admin = await prisma.admin.findUnique({ where: { username: ADMIN_USERNAME } });
  if (!admin) return null;

  const match = await bcrypt.compare(passcode, admin.password);
  if (!match) return null;

  return {
    id: String(admin.id),
    username: admin.username,
    password: admin.password,
    createdAt: admin.createdAt.toISOString(),
  };
}

export async function updateAdminPasscode(newPasscode: string) {
  const hashed = await bcrypt.hash(newPasscode, 10);
  await prisma.admin.updateMany({
    where: { username: ADMIN_USERNAME },
    data: { password: hashed },
  });
}
