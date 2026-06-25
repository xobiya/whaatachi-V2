import { Profile, PaymentRequest, UserRow, PaymentRow } from '../types';

export function userRowToProfile(row: UserRow, baseUrl?: string): Profile {
  const userId = row.id || (row as any)._id;
  // Return a relative URL so the frontend Vite proxy routes it correctly.
  // Absolute URLs (e.g. http://localhost:3005/...) bypass the proxy and fail CORS.
  let img = row.image ? `/api/profiles/${userId}/image` : '';
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
  // Use relative URLs so the frontend proxy routes them correctly (avoids CORS issues in dev).
  const pImage = row.profileId && row.profileImage ? `/api/profiles/${row.profileId}/image` : (row.profileImage ?? '');
  const rImage = row.id && row.receiptImage ? `/api/payments/${row.id}/receipt` : (row.receiptImage ?? undefined);
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

