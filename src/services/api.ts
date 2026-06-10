/// <reference types="vite/client" />
import { Profile, PaymentRequest, SuccessStory, Article } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('whaatachi_token_v1');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { ...getHeaders(), ...(options.headers || {}) },
    });
  } catch {
    throw new Error('Network error');
  }
  const text = await res.text();
  let data: any;
  try { data = JSON.parse(text); } catch { data = { error: text || 'Unknown error' }; }
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    (err as any).status = res.status;
    throw err;
  }
  return data as T;
}

// ── Auth ──
export async function register(data: {
  name: string; gender: 'Male' | 'Female'; age?: number; city?: string;
  lookingFor?: string; phone?: string; telegram?: string; instagram?: string;
}): Promise<{ token: string; user: Profile }> {
  return request('/auth/register', { method: 'POST', body: JSON.stringify(data) });
}

export async function login(name: string, phone?: string): Promise<{ token: string; user: Profile }> {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ name, phone }) });
}

export async function getMe(): Promise<{ user: Profile }> {
  return request('/auth/me');
}

// ── Profiles ──
export async function fetchProfiles(filters?: {
  gender?: string; lookingFor?: string; city?: string; intent?: string;
  search?: string; minAge?: number; maxAge?: number; page?: number; limit?: number;
}): Promise<{ profiles: Profile[]; total: number }> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') params.set(k, String(v)); });
  }
  const qs = params.toString();
  return request(`/profiles${qs ? `?${qs}` : ''}`);
}

export async function fetchProfile(id: string): Promise<{ profile: Profile }> {
  return request(`/profiles/${id}`);
}

export async function updateProfile(id: string, data: Partial<Profile>): Promise<{ user: Profile }> {
  return request(`/profiles/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

// ── Payments ──
export async function submitPayment(data: {
  profileId: string; profileName: string; profileImage?: string;
  senderName: string; senderPhone: string; transactionId: string;
  method: 'Telebirr' | 'CBE Birr'; amount?: number;
}): Promise<{ payment: PaymentRequest }> {
  return request('/payments', { method: 'POST', body: JSON.stringify(data) });
}

export async function fetchPayments(): Promise<{ payments: PaymentRequest[] }> {
  return request('/payments');
}

export async function approvePayment(id: string): Promise<{ payment: PaymentRequest }> {
  return request(`/payments/${id}/approve`, { method: 'PUT' });
}

export async function rejectPayment(id: string): Promise<{ payment: PaymentRequest }> {
  return request(`/payments/${id}/reject`, { method: 'PUT' });
}

export async function checkPayment(): Promise<{ hasPaid: boolean }> {
  return request('/payments/check');
}

// ── Stories ──
export async function fetchStories(): Promise<{ stories: SuccessStory[] }> {
  return request('/stories');
}

export async function createStory(data: {
  coupleNames: string; story: string; year?: string; image?: string;
}): Promise<{ story: SuccessStory }> {
  return request('/stories', { method: 'POST', body: JSON.stringify(data) });
}

export async function deleteStory(id: string): Promise<{ success: boolean }> {
  return request(`/stories/${id}`, { method: 'DELETE' });
}

// ── Articles ──
export async function fetchArticles(): Promise<{ articles: Article[] }> {
  return request('/articles');
}

// ── FAQs ──
export async function fetchFaqs(): Promise<{ faqs: Record<string, { question: string; answer: string }[]> }> {
  return request('/faqs');
}

// ── Admin ──
export async function adminLogin(passcode: string): Promise<{ token: string }> {
  return request('/admin/login', { method: 'POST', body: JSON.stringify({ passcode }) });
}

export async function fetchAdminStats(): Promise<{ stats: any }> {
  return request('/admin/stats');
}
