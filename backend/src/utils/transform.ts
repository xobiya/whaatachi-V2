import { Profile, PaymentRequest, UserRow, PaymentRow } from '../types';

/**
 * Returns the public base URL of the backend API.
 * In production (cPanel), set PUBLIC_API_URL e.g. "https://api.whaatachi.com"
 * In local dev, leave unset — relative URLs work fine via the Vite proxy.
 */
function getPublicBase(): string {
  const raw = process.env.PUBLIC_API_URL || '';
  return raw.replace(/\/+$/, ''); // strip trailing slash
}

export function userRowToProfile(row: UserRow, baseUrl?: string): Profile {
  const userId = row.id || (row as any)._id;
  const base = baseUrl ?? getPublicBase();
  // In production PUBLIC_API_URL is set → absolute URL so Vercel frontend hits the cPanel backend.
  // In local dev PUBLIC_API_URL is unset → relative URL routed correctly by Vite proxy.
  const img = row.image ? `${base}/api/profiles/${userId}/image` : '';
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
  const base = baseUrl ?? getPublicBase();
  // Use absolute URLs in production so the Vercel frontend can reach the cPanel backend.
  const pImage = row.profileId && row.profileImage ? `${base}/api/profiles/${row.profileId}/image` : (row.profileImage ?? '');
  const rImage = row.id && row.receiptImage ? `${base}/api/payments/${row.id}/receipt` : (row.receiptImage ?? undefined);
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

