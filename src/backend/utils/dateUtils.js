// Utils pour gérer les formats de date PrestaShop
export const formatPrestaShopDate = (value) => {
  if (!value) return '';
  const d = typeof value === 'string' ? new Date(value) : (value instanceof Date ? value : new Date(value));
  if (Number.isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
};

export const parsePrestaShopDate = (value) => {
  if (!value) return null;
  try {
    // Accept common formats (YYYY-MM-DD, YYYY-MM-DD HH:mm:ss, ISO)
    const normalized = String(value).trim().replace(' ', 'T');
    const d = new Date(normalized);
    if (Number.isNaN(d.getTime())) return null;
    return d;
  } catch {
    return null;
  }
};

export const getDateKeyFromValue = (value) => {
  if (!value) return '';
  if (typeof value === 'string') {
    const parts = value.split(' ')[0];
    return parts.slice(0, 10);
  }
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const safeToDate = (value) => {
  if (!value && value !== 0) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : new Date(value.getTime());
  }

  const s = String(value).trim();
  if (!s) return null;

  // Try common formats first
  // YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS
  const iso = parsePrestaShopDate(s);
  if (iso) return iso;

  // Handle DD/MM/YYYY, DD-MM-YYYY, MM/DD/YYYY variants
  const sepMatch = s.match(/^(\d{1,4})[\/-](\d{1,2})[\/-](\d{1,4})(?:[ T](.*))?$/);
  if (sepMatch) {
    const p1 = sepMatch[1];
    const p2 = sepMatch[2];
    const p3 = sepMatch[3];
    // If first part has 4 digits -> YYYY - assume Y-M-D
    if (p1.length === 4) {
      const yyyy = Number(p1);
      const mm = Number(p2) - 1;
      const dd = Number(p3);
      const d = new Date(yyyy, mm, dd);
      if (!Number.isNaN(d.getTime())) return d;
    }

    // Otherwise assume DD-MM-YYYY or MM-DD-YYYY -> prefer DD-MM-YYYY
    const dd = Number(p1);
    const mm = Number(p2) - 1;
    const yyyy = Number(p3.length === 2 ? `20${p3}` : p3);
    const d2 = new Date(yyyy, mm, dd);
    if (!Number.isNaN(d2.getTime())) return d2;
  }

  // Fallback to native Date parse
  const n = new Date(s);
  if (!Number.isNaN(n.getTime())) return n;
  return null;
};

const pad = (v) => String(v).padStart(2, '0');

/**
 * Format a date-like value using tokens: YYYY, MM, DD, HH, mm, ss
 * Example patterns: 'YYYY-MM-DD', 'DD/MM/YYYY', 'YYYY/MM/DD HH:mm'
 */
export const formatDateFlexible = (value, pattern = 'YYYY-MM-DD', opts = { useUTC: false }) => {
  const d = safeToDate(value);
  if (!d) return '';

  const Y = opts.useUTC ? d.getUTCFullYear() : d.getFullYear();
  const M = opts.useUTC ? d.getUTCMonth() + 1 : d.getMonth() + 1;
  const D = opts.useUTC ? d.getUTCDate() : d.getDate();
  const H = opts.useUTC ? d.getUTCHours() : d.getHours();
  const m = opts.useUTC ? d.getUTCMinutes() : d.getMinutes();
  const s = opts.useUTC ? d.getUTCSeconds() : d.getSeconds();

  return pattern
    .replace(/YYYY/g, String(Y))
    .replace(/MM/g, pad(M))
    .replace(/DD/g, pad(D))
    .replace(/HH/g, pad(H))
    .replace(/mm/g, pad(m))
    .replace(/ss/g, pad(s));
};

// Convenience wrappers
export const formatToYYYYMMDD = (value) => formatDateFlexible(value, 'YYYY-MM-DD');
export const formatToDDMMYYYY = (value) => formatDateFlexible(value, 'DD-MM-YYYY');
export const formatToDDMMYYYY_slash = (value) => formatDateFlexible(value, 'DD/MM/YYYY');
export const formatToYYYYMMDD_slash = (value) => formatDateFlexible(value, 'YYYY/MM/DD');
export const formatToYYYYMMDD_HHmm = (value) => formatDateFlexible(value, 'YYYY-MM-DD HH:mm');
export const formatToYYYYMMDD_HHmmss = (value) => formatDateFlexible(value, 'YYYY-MM-DD HH:mm:ss');
export const formatToDDMMYYYY_HHmmss = (value) => formatDateFlexible(value, 'DD-MM-YYYY HH:mm:ss');
export const formatToDDMMYYYY_slash_HHmmss = (value) => formatDateFlexible(value, 'DD/MM/YYYY HH:mm:ss');
export const formatToYYYYMMDD_slash_HHmmss = (value) => formatDateFlexible(value, 'YYYY/MM/DD HH:mm:ss');
export const formatToISO = (value, opts = { useUTC: true }) => {
  const d = safeToDate(value);
  if (!d) return '';
  return opts.useUTC ? d.toISOString() : formatDateFlexible(d, 'YYYY-MM-DD HH:mm:ss', { useUTC: false });
};
export const formatToLocale = (value, locale = 'fr-FR', options = {}) => {
  const d = safeToDate(value);
  if (!d) return '';
  return new Intl.DateTimeFormat(locale, options).format(d);
};

export default {
  formatPrestaShopDate,
  parsePrestaShopDate,
  getDateKeyFromValue,
  formatDateFlexible,
  formatToYYYYMMDD,
  formatToDDMMYYYY,
  formatToDDMMYYYY_slash,
  formatToYYYYMMDD_slash,
  formatToYYYYMMDD_HHmm,
  formatToYYYYMMDD_HHmmss,
  formatToDDMMYYYY_HHmmss,
  formatToDDMMYYYY_slash_HHmmss,
  formatToYYYYMMDD_slash_HHmmss,
  formatToYYYYMMDD_HHmmss,
  formatToISO,
  formatToLocale,
};
