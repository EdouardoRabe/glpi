// Petites fonctions utilitaires pratiques

/** Reverse digits of a number (preserve sign)
 *  reverseNumber(123) -> 321
 *  reverseNumber(-120) -> -21
 */
export const reverseNumber = (n) => {
  const num = Number(n) || 0;
  const sign = num < 0 ? -1 : 1;
  const absStr = String(Math.abs(num));
  const rev = absStr.split('').reverse().join('');
  // remove leading zeros
  const parsed = Number(rev);
  return sign * (Number.isNaN(parsed) ? 0 : parsed);
};

/** Reverse a string */
export const reverseString = (s) => String(s || '').split('').reverse().join('');

/** Capitalize first letter */
export const capitalize = (s) => {
  const str = String(s || '');
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/** Title case all words */
export const titleCase = (s) => String(s || '').split(/\s+/).map((w) => capitalize(w.toLowerCase())).join(' ');

/** Slugify a string (URL friendly) */
export const slugify = (s) => {
  if (!s) return '';
  return String(s)
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/** Truncate string to length with suffix */
export const truncate = (s, length = 100, suffix = '...') => {
  const str = String(s || '');
  if (str.length <= length) return str;
  return str.slice(0, length) + suffix;
};

/** Escape HTML */
export const escapeHtml = (s) => String(s ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

/** Date helpers */
export const addDays = (date, days) => {
  const d = date instanceof Date ? new Date(date) : new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + Number(days) || 0);
  return d;
};

export const addMonths = (date, months) => {
  const d = date instanceof Date ? new Date(date) : new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  const m = Number(months) || 0;
  const day = d.getDate();
  d.setMonth(d.getMonth() + m);
  // handle month rollovers
  if (d.getDate() < day) d.setDate(0);
  return d;
};

export const startOfDay = (date) => {
  const d = date instanceof Date ? new Date(date) : new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
};

export const endOfDay = (date) => {
  const d = date instanceof Date ? new Date(date) : new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
};

/** Check palindrome (ignores non-alphanum and case) */
export const isPalindrome = (s) => {
  if (s === null || s === undefined) return false;
  const cleaned = String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!cleaned) return true;
  return cleaned === cleaned.split('').reverse().join('');
};

export default {
  reverseNumber,
  reverseString,
  capitalize,
  titleCase,
  slugify,
  truncate,
  escapeHtml,
  addDays,
  addMonths,
  startOfDay,
  endOfDay,
  isPalindrome,
};
