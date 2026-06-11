import { Profile, PaymentRequest, SuccessStory, Article } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const REQUEST_TIMEOUT = 30000;

const TOKEN_COOKIE = 'whaatachi_token';

function getTokenFromCookie(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${TOKEN_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setTokenCookie(token: string | null) {
  if (token) {
    const maxAge = 2 * 24 * 60 * 60;
    document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } else {
    document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  }
}

let authToken: string | null = getTokenFromCookie();
const inflightMap = new Map<string, Promise<any>>();

export function setAuthToken(token: string | null) {
  authToken = token;
  setTokenCookie(token);
}

export function getAuthToken(): string | null {
  if (!authToken) {
    authToken = getTokenFromCookie();
  }
  return authToken;
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
  return headers;
}

function dedupKey(path: string, options: RequestInit = {}): string | null {
  if (options.method && options.method !== 'GET') return null;
  return `GET ${path}`;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const key = dedupKey(path, options);
  if (key && inflightMap.has(key)) return inflightMap.get(key) as Promise<T>;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  const promise = (async () => {
    let res: Response;
    try {
      res = await fetch(`${API_BASE}${path}`, {
        ...options,
        signal: controller.signal,
        headers: { ...getHeaders(), ...(options.headers || {}) },
      });
    } catch (err: any) {
      if (err?.name === 'AbortError') throw new Error('Request timeout');
      throw new Error('Network error');
    } finally {
      clearTimeout(timer);
    }

    let data: any;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      try { data = JSON.parse(text); } catch { data = { error: text || 'Unknown error' }; }
    }

    if (!res.ok) {
      const err = new Error(data.error || `Request failed (${res.status})`);
      (err as any).status = res.status;
      throw err;
    }
    return data as T;
  })();

  if (key) {
    inflightMap.set(key, promise);
    promise.finally(() => { if (inflightMap.get(key) === promise) inflightMap.delete(key); });
  }

  return promise;
}

// ── Auth ──
export async function register(data: {
  id?: string; name: string; gender: 'Male' | 'Female'; age?: number; city?: string;
  address?: string; bio?: string; image?: string; status?: string;
  relationshipIntent?: string; lookingFor?: string;
  phone?: string; telegram?: string; instagram?: string; email?: string;
}): Promise<{ token: string; user: Profile }> {
  return request('/auth/register', { method: 'POST', body: JSON.stringify(data) });
}

export async function login(name?: string, phone?: string, telegram?: string, instagram?: string): Promise<{ token: string; user: Profile }> {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ name, phone, telegram, instagram }) });
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
  method: 'Telebirr' | 'CBE Birr'; amount?: number; receiptImage?: string;
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

// ── Admin: Verification ──
export async function toggleProfileVerification(id: string): Promise<{ verified: boolean }> {
  return request(`/admin/profiles/${id}/verify`, { method: 'PUT' });
}

// ── Admin ──
export async function adminLogin(passcode: string): Promise<{ token: string }> {
  return request('/admin/login', { method: 'POST', body: JSON.stringify({ passcode }) });
}

export async function fetchAdminStats(): Promise<{ stats: any }> {
  return request('/admin/stats');
}

export async function updateAdminPasscode(newPasscode: string): Promise<{ success: boolean }> {
  return request('/admin/passcode', { method: 'PUT', body: JSON.stringify({ newPasscode }) });
}

// ── Admin: Articles ──
export async function createArticle(data: {
  title: string; excerpt?: string; category?: string;
  readTime?: string; date?: string; image?: string; content?: string;
}): Promise<{ article: any }> {
  return request('/articles', { method: 'POST', body: JSON.stringify(data) });
}

export async function deleteArticle(id: string): Promise<{ success: boolean }> {
  return request(`/articles/${id}`, { method: 'DELETE' });
}

// ── Admin: FAQs ──
export async function fetchAllFaqs(): Promise<{ faqs: any[] }> {
  return request('/faqs/all');
}

export async function createFaq(data: {
  category: string; question: string; answer: string; sortOrder?: number;
}): Promise<{ faq: any }> {
  return request('/faqs', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateFaq(id: string, data: {
  category?: string; question?: string; answer?: string; sortOrder?: number;
}): Promise<{ faq: any }> {
  return request(`/faqs/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteFaq(id: string): Promise<{ success: boolean }> {
  return request(`/faqs/${id}`, { method: 'DELETE' });
}
