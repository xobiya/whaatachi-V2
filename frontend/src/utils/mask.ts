export function maskPhone(val: string) {
  const digits = val.replace(/\D/g, '');
  if (digits.length >= 9) return digits.slice(0, 2) + 'XX XXX' + digits.slice(-3);
  return val.slice(0, 3) + '***';
}

export function maskHandle(val: string) {
  if (!val || val === '---') return '---';
  const at = val.startsWith('@') ? '@' : '';
  const body = val.replace(/^@/, '');
  if (body.length <= 2) return at + body + '***';
  return at + body.slice(0, 2) + '...';
}
