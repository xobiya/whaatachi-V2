import { Profile, PaymentRequest, SuccessStory, UserRow, PaymentRow, StoryRow } from '../types';

export function userRowToProfile(row: UserRow): Profile {
  return {
    id: row.id,
    name: row.name,
    age: row.age ?? 0,
    city: row.city ?? '',
    address: row.address ?? undefined,
    bio: row.bio ?? '',
    gender: row.gender,
    lookingFor: row.lookingFor ?? undefined,
    image: row.image ?? '',
    status: row.status ?? 'Offline',
    relationshipIntent: (row.relationshipIntent as Profile['relationshipIntent']) ?? 'Friendship',
    interests: row.interests ?? [],
    verified: row.verified === true,
    contactInfo: {
      phone: row.phone ?? '',
      telegram: row.telegram ?? '',
      instagram: row.instagram ?? '',
      email: row.email ?? '',
    },
  };
}

export function paymentRowToPayment(row: PaymentRow): PaymentRequest {
  return {
    id: row.id,
    profileId: row.profileId,
    profileName: row.profileName,
    profileImage: row.profileImage ?? '',
    senderName: row.senderName,
    senderPhone: row.senderPhone,
    transactionId: row.transactionId,
    method: row.method,
    amount: row.amount,
    timestamp: row.createdAt,
    status: row.status,
    receiptImage: row.receiptImage ?? undefined,
  };
}

export function storyRowToStory(row: StoryRow): SuccessStory {
  return {
    id: row.id,
    coupleNames: row.coupleNames,
    story: row.story,
    year: row.year ?? '',
    image: row.image ?? '',
  };
}
