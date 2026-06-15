import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  _id: { type: String },
  name: { type: String, required: true },
  age: Number,
  city: String,
  address: String,
  bio: String,
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  lookingFor: { type: String, enum: ['Male', 'Female'] },
  image: String,
  status: { type: String, enum: ['Online', 'Offline', 'Recently Active'], default: 'Online' },
  relationshipIntent: { type: String, enum: ['True Relationship', 'Friendship', 'Friends with Benefits', 'Only Sex'] },
  interests: { type: [String], default: [] },
  verified: { type: Boolean, default: false },
  phone: String,
  telegram: String,
  instagram: String,
  email: String,
}, { timestamps: true, _id: false });

userSchema.index({ gender: 1, lookingFor: 1 });
userSchema.index({ gender: 1, city: 1 });
userSchema.index({ name: 1 });
userSchema.index({ status: 1 });
userSchema.index({ verified: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });
userSchema.index({ telegram: 1 }, { unique: true, sparse: true });
userSchema.index({ instagram: 1 }, { unique: true, sparse: true });

const User = mongoose.model('User', userSchema) as any;

export async function findUserById(id: string): Promise<any> {
  return User.findById(id).lean();
}

export async function findUserByName(name: string): Promise<any[]> {
  return User.find({ name }).collation({ locale: 'en', strength: 2 }).lean();
}

export async function findUserByContact(telegram: string | null, instagram: string | null): Promise<any> {
  const exactOrClauses: any[] = [];
  const regexOrClauses: any[] = [];

  if (telegram) {
    const tg = telegram.replace(/^@/, '');
    const escaped = tg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    exactOrClauses.push({ telegram: tg });
    exactOrClauses.push({ telegram: `@${tg}` });
    regexOrClauses.push({ telegram: { $regex: new RegExp(`^@?${escaped}$`, 'i') } });
  }

  if (instagram) {
    const ig = instagram.replace(/^@/, '');
    const escaped = ig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    exactOrClauses.push({ instagram: ig });
    exactOrClauses.push({ instagram: `@${ig}` });
    regexOrClauses.push({ instagram: { $regex: new RegExp(`^@?${escaped}$`, 'i') } });
  }

  if (exactOrClauses.length > 0) {
    const exactMatch = await User.findOne({ $or: exactOrClauses }).lean();
    if (exactMatch) return exactMatch;
  }

  if (regexOrClauses.length > 0) {
    return User.findOne({ $or: regexOrClauses }).lean();
  }

  return null;
}

export async function findUserByPhone(phone: string): Promise<any> {
  // 1. Try exact match
  const exact = await User.findOne({ phone }).lean();
  if (exact) return exact;

  // 2. Try normalized exact match (remove spaces)
  const normalized = phone.replace(/\s+/g, '');
  if (normalized !== phone) {
    const exactNormalized = await User.findOne({ phone: normalized }).lean();
    if (exactNormalized) return exactNormalized;
  }

  // 3. Fallback to flexible case-insensitive regex match
  const escaped = phone.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const flexible = escaped.replace(/\s+/g, '\\s?');
  return User.findOne({ phone: { $regex: new RegExp(`^${flexible}$`, 'i') } }).lean();
}

export async function findUserByLogin(login: string): Promise<any> {
  // 1. Try exact matches first on phone/telegram/instagram
  const sanitized = login.replace(/^@/, '');
  const exactMatch = await User.findOne({
    $or: [
      { phone: login },
      { phone: sanitized },
      { telegram: login },
      { telegram: sanitized },
      { telegram: `@${sanitized}` },
      { instagram: login },
      { instagram: sanitized },
      { instagram: `@${sanitized}` }
    ]
  }).lean();

  if (exactMatch) return exactMatch;

  // 2. Fallback to regex query
  const escaped = sanitized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^@?${escaped}$`, 'i');
  return User.findOne({
    $or: [
      { phone: { $regex: regex } },
      { telegram: { $regex: regex } },
      { instagram: { $regex: regex } },
    ]
  }).lean();
}

export async function checkDuplicate(field: string, value: string, excludeId?: string): Promise<boolean> {
  if (!value) return false;
  const query: Record<string, any> = {};
  if (field === 'phone') {
    query.phone = { $regex: new RegExp(`^${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') };
  } else if (field === 'telegram' || field === 'instagram') {
    const val = value.replace(/^@/, '');
    query[field] = { $regex: new RegExp(`^@?${val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') };
  } else {
    query[field] = value;
  }
  if (excludeId) query._id = { $ne: excludeId };
  const count = await User.countDocuments(query);
  return count > 0;
}

function buildFilterObject(filters: Record<string, any>): Record<string, any> {
  const filter: Record<string, any> = {};
  if (filters.gender) filter.gender = filters.gender;
  if (filters.lookingFor) filter.lookingFor = filters.lookingFor;
  if (filters.city) filter.city = new RegExp(`^${filters.city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
  if (filters.intent) filter.relationshipIntent = filters.intent;
  if (filters.search) {
    const searchRegex = new RegExp(filters.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: searchRegex }, { city: searchRegex }];
  }
  if (filters.minAge || filters.maxAge) {
    filter.age = {};
    if (filters.minAge) filter.age.$gte = filters.minAge;
    if (filters.maxAge) filter.age.$lte = filters.maxAge;
  }
  return filter;
}

export async function findUsersWithFilters(filters: {
  gender?: string;
  lookingFor?: string;
  city?: string;
  intent?: string;
  search?: string;
  minAge?: number;
  maxAge?: number;
  page?: number;
  limit?: number;
}): Promise<{ rows: any[]; total: number }> {
  const filter = buildFilterObject(filters);
  const page = filters.page || 1;
  const limit = filters.limit || 50;
  const skip = (page - 1) * limit;

  const [rows, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);
  return { rows, total };
}

export async function createUser(data: Record<string, any>): Promise<any> {
  const userDoc: Record<string, any> = {
    _id: data.id,
    name: data.name,
    age: data.age,
    city: data.city,
    address: data.address,
    bio: data.bio,
    gender: data.gender,
    lookingFor: data.lookingFor,
    image: data.image,
    status: data.status || 'Online',
    relationshipIntent: data.relationshipIntent,
    interests: data.interests || [],
    verified: false,
  };

  const optionalFields = ['phone', 'telegram', 'instagram', 'email'];
  for (const f of optionalFields) {
    if (data[f] !== undefined && data[f] !== null && data[f] !== '') {
      userDoc[f] = data[f];
    }
  }

  return User.create(userDoc);
}

export async function updateUser(id: string, data: Record<string, any>): Promise<any> {
  const allowed = ['name', 'age', 'city', 'address', 'bio', 'lookingFor', 'image',
    'status', 'relationshipIntent', 'interests', 'phone', 'telegram', 'instagram', 'email'];
  const update: Record<string, any> = {};
  const unset: Record<string, any> = {};

  for (const key of allowed) {
    if (data[key] !== undefined) {
      if (['phone', 'telegram', 'instagram', 'email'].includes(key) && (data[key] === '' || data[key] === null)) {
        unset[key] = 1;
      } else {
        update[key] = key === 'interests' && Array.isArray(data[key]) ? data[key] : data[key];
      }
    }
  }

  const updateOp: Record<string, any> = {};
  if (Object.keys(update).length > 0) {
    updateOp.$set = update;
  }
  if (Object.keys(unset).length > 0) {
    updateOp.$unset = unset;
  }

  if (Object.keys(updateOp).length > 0) {
    return User.findByIdAndUpdate(id, updateOp, { new: true }).lean();
  }
  return User.findById(id).lean();
}

export async function verifyUser(userId: string): Promise<void> {
  await User.findByIdAndUpdate(userId, { $set: { verified: true } });
}

export async function toggleUserVerification(userId: string): Promise<{ verified: boolean } | null> {
  const user = await User.findById(userId);
  if (!user) return null;
  const newVal = !user.verified;
  await User.findByIdAndUpdate(userId, { $set: { verified: newVal } });
  return { verified: newVal };
}

export async function countUsers(): Promise<number> {
  return User.countDocuments();
}

export async function countUsersByGender(gender: string): Promise<number> {
  return User.countDocuments({ gender });
}

export async function countVerifiedUsers(): Promise<number> {
  return User.countDocuments({ verified: true });
}

export default User;
