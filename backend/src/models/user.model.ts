import prisma from '../lib/prisma';

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { interests: { select: { interest: true } } },
  });
}

export async function findUserByName(name: string) {
  const users = await prisma.user.findMany({
    where: { name: { equals: name, mode: 'insensitive' } },
    include: { interests: { select: { interest: true } } },
  });
  return users;
}

export async function findUserByContact(telegram: string | null, instagram: string | null) {
  if (!telegram && !instagram) return null;

  const or: any[] = [];
  if (telegram) {
    const tg = telegram.replace(/^@/, '');
    or.push({ telegram: { equals: tg, mode: 'insensitive' } });
    or.push({ telegram: { equals: `@${tg}`, mode: 'insensitive' } });
  }
  if (instagram) {
    const ig = instagram.replace(/^@/, '');
    or.push({ instagram: { equals: ig, mode: 'insensitive' } });
    or.push({ instagram: { equals: `@${ig}`, mode: 'insensitive' } });
  }

  const user = await prisma.user.findFirst({
    where: { OR: or },
    include: { interests: { select: { interest: true } } },
  });
  return user;
}

export async function findUserByPhone(phone: string) {
  const normalized = phone.replace(/\s+/g, '');

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { phone: { equals: phone, mode: 'insensitive' } },
        { phone: { equals: normalized, mode: 'insensitive' } },
      ],
    },
    include: { interests: { select: { interest: true } } },
  });
  return user;
}

export async function findUserByLogin(login: string) {
  const sanitized = login.replace(/^@/, '');

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { phone: { equals: login, mode: 'insensitive' } },
        { phone: { equals: sanitized, mode: 'insensitive' } },
        { telegram: { equals: login, mode: 'insensitive' } },
        { telegram: { equals: sanitized, mode: 'insensitive' } },
        { telegram: { equals: `@${sanitized}`, mode: 'insensitive' } },
        { instagram: { equals: login, mode: 'insensitive' } },
        { instagram: { equals: sanitized, mode: 'insensitive' } },
        { instagram: { equals: `@${sanitized}`, mode: 'insensitive' } },
      ],
    },
    include: { interests: { select: { interest: true } } },
  });
  return user;
}

export async function checkDuplicate(field: string, value: string, excludeId?: string) {
  if (!value) return false;

  let where: any;
  if (field === 'phone') {
    where = { phone: { equals: value, mode: 'insensitive' } };
  } else if (field === 'telegram' || field === 'instagram') {
    const val = value.replace(/^@/, '');
    where = {
      OR: [
        { [field]: { equals: val, mode: 'insensitive' } },
        { [field]: { equals: `@${val}`, mode: 'insensitive' } },
      ],
    };
  } else {
    where = { [field]: value };
  }

  if (excludeId) {
    where = { ...where, id: { not: excludeId } };
  }

  const count = await prisma.user.count({ where });
  return count > 0;
}

function buildFilterObject(filters: Record<string, any>) {
  const and: any[] = [];

  if (filters.gender) and.push({ gender: filters.gender });
  if (filters.lookingFor) and.push({ lookingFor: filters.lookingFor });
  if (filters.city) and.push({ city: { equals: filters.city, mode: 'insensitive' } });
  if (filters.intent) and.push({ relationshipIntent: filters.intent });
  if (filters.search) {
    and.push({
      OR: [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { city: { contains: filters.search, mode: 'insensitive' } },
      ],
    });
  }
  if (filters.minAge || filters.maxAge) {
    const ageFilter: any = {};
    if (filters.minAge) ageFilter.gte = filters.minAge;
    if (filters.maxAge) ageFilter.lte = filters.maxAge;
    and.push({ age: ageFilter });
  }

  return and.length > 0 ? { AND: and } : {};
}

function toProfileDoc(doc: any) {
  const interests = doc.interests?.map((i: any) => i.interest) ?? [];
  return {
    id: doc.id,
    _id: doc.id,
    name: doc.name,
    age: doc.age ?? null,
    city: doc.city ?? null,
    address: doc.address ?? null,
    bio: doc.bio ?? null,
    gender: doc.gender,
    lookingFor: doc.lookingFor ?? null,
    image: doc.image ?? null,
    status: doc.status ?? 'Offline',
    relationshipIntent: doc.relationshipIntent ?? null,
    interests,
    verified: doc.verified === true,
    phone: doc.phone ?? null,
    telegram: doc.telegram ?? null,
    instagram: doc.instagram ?? null,
    email: doc.email ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

let cachedAllProfiles: { rows: any[]; total: number } | null = null;
let cacheTimer: ReturnType<typeof setInterval> | null = null;

export async function refreshProfileCache() {
  try {
    const rows = await prisma.user.findMany({
      orderBy: { id: 'desc' },
      take: 1000,
      include: { interests: { select: { interest: true } } },
    });
    const total = rows.length;
    cachedAllProfiles = { rows: rows.map(toProfileDoc), total };
    console.log('[profile-cache] refreshed: %d profiles', total);
  } catch (err: any) {
    console.error('[profile-cache] refresh error:', err?.message || err);
  }
}

export function startProfileCache(intervalMs = 60000) {
  if (cacheTimer) clearInterval(cacheTimer);
  refreshProfileCache();
  cacheTimer = setInterval(refreshProfileCache, intervalMs);
}

export function stopProfileCache() {
  if (cacheTimer) {
    clearInterval(cacheTimer);
    cacheTimer = null;
  }
}

export async function getAllProfiles() {
  if (cachedAllProfiles) {
    return { profiles: cachedAllProfiles.rows, total: cachedAllProfiles.total };
  }
  await refreshProfileCache();
  return { profiles: cachedAllProfiles?.rows ?? [], total: cachedAllProfiles?.total ?? 0 };
}

export async function createUser(data: Record<string, any>) {
  const { id, name, age, city, address, bio, gender, lookingFor, image,
    status, relationshipIntent, interests, phone, telegram, instagram, email } = data;

  const user = await prisma.user.create({
    data: {
      id, name, age, city, address, bio, gender,
      lookingFor: lookingFor ?? undefined,
      image: image ?? undefined,
      status: status || 'Online',
      relationshipIntent: relationshipIntent ?? undefined,
      phone: phone || undefined,
      telegram: telegram || undefined,
      instagram: instagram || undefined,
      email: email || undefined,
      interests: interests?.length ? {
        create: interests.map((interest: string) => ({ interest })),
      } : undefined,
    },
    include: { interests: { select: { interest: true } } },
  });
  return user;
}

export async function updateUser(id: string, data: Record<string, any>) {
  const existing = await prisma.user.findUnique({
    where: { id },
    include: { interests: { select: { interest: true } } },
  });
  if (!existing) return null;

  const updateData: any = {};
  const allowed = ['name', 'age', 'city', 'address', 'bio', 'lookingFor', 'image',
    'status', 'relationshipIntent', 'phone', 'telegram', 'instagram', 'email'];

  for (const key of allowed) {
    if (data[key] !== undefined) {
      if (['phone', 'telegram', 'instagram', 'email'].includes(key) && (data[key] === '' || data[key] === null)) {
        updateData[key] = null;
      } else {
        updateData[key] = data[key];
      }
    }
  }

  if (data.interests !== undefined) {
    await prisma.userInterest.deleteMany({ where: { userId: id } });
    if (Array.isArray(data.interests) && data.interests.length > 0) {
      await prisma.userInterest.createMany({
        data: data.interests.map((interest: string) => ({ userId: id, interest })),
      });
    }
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    include: { interests: { select: { interest: true } } },
  });
  return user;
}

export async function verifyUser(userId: string) {
  await prisma.user.update({ where: { id: userId }, data: { verified: true } });
}

export async function toggleUserVerification(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { verified: true } });
  if (!user) return null;
  const newVal = !user.verified;
  await prisma.user.update({ where: { id: userId }, data: { verified: newVal } });
  return { verified: newVal };
}

export async function countUsers() {
  return prisma.user.count();
}

export async function deleteUser(id: string) {
  const existing = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return null;
  await prisma.userInterest.deleteMany({ where: { userId: id } });
  return prisma.user.delete({ where: { id } });
}

export async function countUsersByGender(gender: string) {
  return prisma.user.count({ where: { gender } });
}

export async function countVerifiedUsers() {
  return prisma.user.count({ where: { verified: true } });
}
