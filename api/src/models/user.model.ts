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

const User = mongoose.model('User', userSchema) as any;

export async function findUserById(id: string): Promise<any> {
  return User.findById(id).lean();
}

export async function findUserByName(name: string): Promise<any[]> {
  return User.find({ name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }).lean();
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
  return User.create({
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
    phone: data.phone,
    telegram: data.telegram,
    instagram: data.instagram,
    email: data.email,
  });
}

export async function updateUser(id: string, data: Record<string, any>): Promise<void> {
  const allowed = ['name', 'age', 'city', 'address', 'bio', 'lookingFor', 'image',
    'status', 'relationshipIntent', 'interests', 'phone', 'telegram', 'instagram', 'email'];
  const update: Record<string, any> = {};
  for (const key of allowed) {
    if (data[key] !== undefined) {
      update[key] = key === 'interests' && Array.isArray(data[key]) ? data[key] : data[key];
    }
  }
  if (Object.keys(update).length > 0) {
    await User.findByIdAndUpdate(id, { $set: update });
  }
}

export async function verifyUser(userId: string): Promise<void> {
  await User.findByIdAndUpdate(userId, { $set: { verified: true } });
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
