export interface Profile {
  id: string;
  name: string;
  age: number;
  city: string;
  address?: string;
  bio: string;
  gender: 'Male' | 'Female';
  lookingFor?: 'Male' | 'Female';
  image: string;
  status: 'Online' | 'Offline' | 'Recently Active';
  relationshipIntent: 'True Relationship' | 'Friendship' | 'Friends with Benefits' | 'Only Sex';
  interests: string[];
  verified: boolean;
  contactInfo: {
    phone: string;
    telegram: string;
    instagram: string;
    email: string;
  };
}

export interface PaymentRequest {
  id: string;
  userId: string;
  profileId: string;
  profileName: string;
  profileImage: string;
  senderName: string;
  senderPhone: string;
  transactionId: string;
  method: 'Telebirr' | 'CBE Birr';
  amount: number;
  timestamp: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  receiptImage?: string;
}

export interface AdminStats {
  totalUsers: number;
  maleUsers: number;
  femaleUsers: number;
  verifiedUsers: number;
  pendingPayments: number;
  approvedPayments: number;
  revenue: number;
}

export interface UserRow {
  id: string;
  name: string;
  age: number | null;
  city: string | null;
  address: string | null;
  bio: string | null;
  gender: 'Male' | 'Female';
  lookingFor: 'Male' | 'Female' | null;
  image: string | null;
  status: 'Online' | 'Offline' | 'Recently Active';
  relationshipIntent: string | null;
  interests: string[];
  verified: boolean | number;
  phone: string | null;
  telegram: string | null;
  instagram: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRow {
  id: string;
  userId: string;
  profileId: string;
  profileName: string;
  profileImage: string | null;
  senderName: string;
  senderPhone: string;
  transactionId: string;
  method: 'Telebirr' | 'CBE Birr';
  amount: number;
  receiptImage: string | null;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  updatedAt: string;
}

export interface AdminRow {
  id: number;
  username: string;
  password: string;
  createdAt: string;
}


