// Fonctions utilitaires pour manipulation de strings

/**
 * Concaténer un string avec un autre string
 * @param {string} str1
 * @param {string} str2
 * @returns {string}
 */
export const concatStrings = (str1, str2) => {
  return String(str1 || '') + String(str2 || '');
};

/**
 * Concaténer avec un séparateur
 * @param {string} str1
 * @param {string} str2
 * @param {string} separator
 * @returns {string}
 */
export const concatStringsWith = (str1, str2, separator = '') => {
  const s1 = String(str1 || '').trim();
  const s2 = String(str2 || '').trim();

  if (!s1 && !s2) return '';
  if (!s1) return s2;
  if (!s2) return s1;

  return `${s1}${separator}${s2}`;
};

/**
 * Concaténer un string avec un objet (convertit l'objet en string au format JSON)
 * @param {string} str
 * @param {any} obj
 * @returns {string}
 */
export const concatStringWithObject = (str, obj) => {
  const strPart = String(str || '');
  const objStr = typeof obj === 'string' ? obj : JSON.stringify(obj);
  return strPart + objStr;
};

/**
 * Concaténer un objet avec un string (convertit l'objet en string au format JSON)
 * @param {any} obj
 * @param {string} str
 * @returns {string}
 */
export const concatObjectWithString = (obj, str) => {
  const objStr = typeof obj === 'string' ? obj : JSON.stringify(obj);
  const strPart = String(str || '');
  return objStr + strPart;
};

/**
 * Concaténer un string avec un objet avec séparateur
 * @param {string} str
 * @param {any} obj
 * @param {string} separator
 * @returns {string}
 */
export const concatStringWithObjectSeparator = (str, obj, separator = '') => {
  const strPart = String(str || '').trim();
  const objStr = typeof obj === 'string' ? obj : JSON.stringify(obj);

  if (!strPart && !objStr) return '';
  if (!strPart) return objStr;
  if (!objStr) return strPart;

  return `${strPart}${separator}${objStr}`;
};

/**
 * Concaténer un objet avec un string avec séparateur
 * @param {any} obj
 * @param {string} str
 * @param {string} separator
 * @returns {string}
 */
export const concatObjectWithStringSeparator = (obj, str, separator = '') => {
  const objStr = typeof obj === 'string' ? obj : JSON.stringify(obj);
  const strPart = String(str || '').trim();

  if (!objStr && !strPart) return '';
  if (!objStr) return strPart;
  if (!strPart) return objStr;

  return `${objStr}${separator}${strPart}`;
};

/**
 * Convertir n'importe quel type en string
 * @param {any} value
 * @returns {string}
 */
export const toString = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
};

/**
 * Convertir n'importe quel type en string avec formatage
 * @param {any} value
 * @param {number} indent - indentation JSON (0 = pas de formatage)
 * @returns {string}
 */
export const toStringFormatted = (value, indent = 2) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, indent);
    } catch {
      return String(value);
    }
  }
  return String(value);
};

/**
 * Joindre un array de valeurs en un string
 * @param {array} values
 * @param {string} separator
 * @returns {string}
 */
export const joinValues = (values, separator = ', ') => {
  if (!Array.isArray(values)) return '';
  return values.map(v => toString(v)).join(separator);
};

/**
 * Répéter un string plusieurs fois
 * @param {string} str
 * @param {number} count
 * @returns {string}
 */
export const repeatString = (str, count) => {
  const s = String(str || '');
  const c = Number(count) || 0;
  return s.repeat(Math.max(0, c));
};

/**
 * Palmar un string avec un caractère
 * @param {string} str
 * @param {number} length
 * @param {string} padChar - caractère de padding (défaut: espace)
 * @returns {string}
 */
export const padLeft = (str, length, padChar = ' ') => {
  const s = String(str || '');
  const pad = String(padChar || ' ')[0]; // Prendre que le premier char
  return s.padStart(length, pad);
};

/**
 * Palmar un string à droite avec un caractère
 * @param {string} str
 * @param {number} length
 * @param {string} padChar - caractère de padding (défaut: espace)
 * @returns {string}
 */
export const padRight = (str, length, padChar = ' ') => {
  const s = String(str || '');
  const pad = String(padChar || ' ')[0];
  return s.padEnd(length, pad);
};

/**
 * Remplacer tous les occurrences d'un string
 * @param {string} str
 * @param {string} search
 * @param {string} replacement
 * @returns {string}
 */
export const replaceAll = (str, search, replacement) => {
  const s = String(str || '');
  const searchStr = String(search || '');
  const replaceStr = String(replacement || '');

  if (!searchStr) return s;
  return s.replaceAll(searchStr, replaceStr);
};

/**
 * Inverser un string
 * @param {string} str
 * @returns {string}
 */
export const reverseString = (str) => {
  return String(str || '').split('').reverse().join('');
};

/**
 * Vérifier si un string commence par un autre
 * @param {string} str
 * @param {string} prefix
 * @param {boolean} caseSensitive
 * @returns {boolean}
 */
export const startsWith = (str, prefix, caseSensitive = true) => {
  const s = String(str || '');
  const p = String(prefix || '');

  if (!caseSensitive) {
    return s.toLowerCase().startsWith(p.toLowerCase());
  }

  return s.startsWith(p);
};

/**
 * Vérifier si un string finit par un autre
 * @param {string} str
 * @param {string} suffix
 * @param {boolean} caseSensitive
 * @returns {boolean}
 */
export const endsWith = (str, suffix, caseSensitive = true) => {
  const s = String(str || '');
  const su = String(suffix || '');

  if (!caseSensitive) {
    return s.toLowerCase().endsWith(su.toLowerCase());
  }

  return s.endsWith(su);
};

/**
 * Extraire un substring
 * @param {string} str
 * @param {number} start
 * @param {number} end
 * @returns {string}
 */
export const substring = (str, start, end) => {
  return String(str || '').substring(start, end);
};

/**
 * Fractionner un string en array
 * @param {string} str
 * @param {string|regex} separator
 * @param {number} limit
 * @returns {array}
 */
export const split = (str, separator = '', limit = undefined) => {
  return String(str || '').split(separator, limit);
};

export default {
  concatStrings,
  concatStringsWith,
  concatStringWithObject,
  concatObjectWithString,
  concatStringWithObjectSeparator,
  concatObjectWithStringSeparator,
  toString,
  toStringFormatted,
  joinValues,
  repeatString,
  padLeft,
  padRight,
  replaceAll,
  reverseString,
  startsWith,
  endsWith,
  substring,
  split,
};
