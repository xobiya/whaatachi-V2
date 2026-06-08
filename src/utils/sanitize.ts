export function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>/g, '').replace(/[<>"'&]/g, '').trim();
}

export function sanitizePhone(phone: string): string {
  return phone.replace(/[^0-9+\-\s]/g, '').trim();
}

export function sanitizeTelegram(handle: string): string {
  return handle.replace(/[^@a-zA-Z0-9_]/g, '').trim();
}

export function sanitizeInstagram(handle: string): string {
  return handle.replace(/[^@a-zA-Z0-9_.]/g, '').trim();
}
