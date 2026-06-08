import { describe, it, expect } from 'vitest';
import { sanitizeInput, sanitizePhone, sanitizeTelegram, sanitizeInstagram } from '../utils/sanitize';

describe('sanitizeInput', () => {
  it('strips HTML tags', () => {
    expect(sanitizeInput('<script>alert("xss")</script>hello')).toBe('alert(xss)hello');
  });

  it('removes dangerous characters', () => {
    expect(sanitizeInput('hello<>"&')).toBe('hello');
  });

  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });
});

describe('sanitizePhone', () => {
  it('keeps only digits, +, -, and spaces', () => {
    expect(sanitizePhone('+251 911 234 567')).toBe('+251 911 234 567');
  });

  it('removes letters', () => {
    expect(sanitizePhone('0911abc2345')).toBe('09112345');
  });
});

describe('sanitizeTelegram', () => {
  it('keeps @, letters, numbers, underscore', () => {
    expect(sanitizeTelegram('@hello_world')).toBe('@hello_world');
  });

  it('removes spaces and special chars', () => {
    expect(sanitizeTelegram('@hello world!')).toBe('@helloworld');
  });
});

describe('sanitizeInstagram', () => {
  it('keeps @, letters, numbers, underscore, dot', () => {
    expect(sanitizeInstagram('@user.name_1')).toBe('@user.name_1');
  });
});
