import { describe, it, expect } from 'vitest';
import { t } from '../i18n';

describe('i18n', () => {
  it('returns English translation for en', () => {
    expect(t('app.name', 'en')).toBe('Whaatachi');
  });

  it('returns Amharic translation for am', () => {
    expect(t('app.name', 'am')).toBe('ዋታቺ');
  });

  it('falls back to English key when Amharic missing', () => {
    expect(t('nav.home', 'am')).toBe('መነሻ');
  });

  it('returns the key itself when no translation found', () => {
    expect(t('nonexistent.key', 'en')).toBe('nonexistent.key');
  });
});
