import { Profile, PaymentRequest, UserRow, PaymentRow } from '../types';

export function userRowToProfile(row: UserRow, baseUrl?: string): Profile {
  let img = row.image ?? '';
  if (img && img.startsWith('data:') && baseUrl) {
    img = `${baseUrl}/api/profiles/${row.id || (row as any)._id}/image`;
  }
  return {
    id: row.id || (row as any)._id,
    name: row.name,
    age: row.age ?? 0,
    city: row.city ?? '',
    address: row.address ?? undefined,
    bio: row.bio ?? '',
    gender: row.gender,
    lookingFor: row.lookingFor ?? undefined,
    image: img,
    status: row.status ?? 'Offline',
    relationshipIntent: (row.relationshipIntent as Profile['relationshipIntent']) ?? 'Friendship',
    interests: Array.isArray(row.interests) ? row.interests.map((i: any) => i.interest ?? i) : [],
    verified: row.verified == true,
    contactInfo: {
      phone: row.phone ?? '',
      telegram: row.telegram ?? '',
      instagram: row.instagram ?? '',
      email: row.email ?? '',
    },
  };
}

export function paymentRowToPayment(row: PaymentRow, baseUrl?: string): PaymentRequest {
  const pImage = row.profileId && baseUrl && row.profileImage ? `${baseUrl}/api/profiles/${row.profileId}/image` : (row.profileImage ?? '');
  const rImage = row.id && row.receiptImage && baseUrl ? `${baseUrl}/api/payments/${row.id}/receipt` : (row.receiptImage ?? undefined);
  return {
    id: row.id || (row as any)._id,
    userId: row.userId,
    profileId: row.profileId,
    profileName: row.profileName,
    profileImage: pImage,
    senderName: row.senderName,
    senderPhone: row.senderPhone,
    transactionId: row.transactionId,
    method: row.method,
    amount: row.amount,
    timestamp: row.createdAt,
    status: row.status,
    receiptImage: rImage,
  };
}

