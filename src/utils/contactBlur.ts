export function blurPhone(phone: string): string {
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.length <= 4) return cleaned;
  return cleaned.slice(0, 4) + '*'.repeat(cleaned.length - 5) + cleaned.slice(-1);
}

export function blurTelegram(tg: string): string {
  if (tg.length <= 3) return tg;
  return tg.slice(0, 2) + '*'.repeat(tg.length - 3) + tg.slice(-1);
}

export function blurInstagram(ig: string): string {
  if (!ig || ig.length <= 3) return ig || '';
  return ig.slice(0, 2) + '*'.repeat(ig.length - 3) + ig.slice(-1);
}

export function blurEmail(email: string): string {
  const atIndex = email.indexOf('@');
  if (atIndex <= 1) return '***' + email.slice(atIndex);
  return email[0] + '***' + email.slice(atIndex - 1);
}

export function blurContactInfo(contact: { phone: string; telegram: string; instagram: string; email: string }) {
  return {
    phone: blurPhone(contact.phone),
    telegram: blurTelegram(contact.telegram),
    instagram: contact.instagram ? blurInstagram(contact.instagram) : '',
    email: blurEmail(contact.email),
  };
}
