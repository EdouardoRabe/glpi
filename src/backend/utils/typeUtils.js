// Fonctions utilitaires pour vérifier les types

/**
 * Obtenir le type d'une valeur
 * @param {any} value
 * @returns {string}
 */
export const getType = (value) => {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array';
  if (value instanceof Date) return 'date';
  return typeof value;
};

/**
 * Vérifier si c'est une string
 * @param {any} value
 * @returns {boolean}
 */
export const isString = (value) => typeof value === 'string';

/**
 * Vérifier si c'est un nombre
 * @param {any} value
 * @returns {boolean}
 */
export const isNumber = (value) => typeof value === 'number' && Number.isFinite(value);

/**
 * Vérifier si c'est un booléen
 * @param {any} value
 * @returns {boolean}
 */
export const isBoolean = (value) => typeof value === 'boolean';

/**
 * Vérifier si c'est un array
 * @param {any} value
 * @returns {boolean}
 */
export const isArray = (value) => Array.isArray(value);

/**
 * Vérifier si c'est un objet
 * @param {any} value
 * @returns {boolean}
 */
export const isObject = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date);
};

/**
 * Vérifier si c'est null
 * @param {any} value
 * @returns {boolean}
 */
export const isNull = (value) => value === null;

/**
 * Vérifier si c'est undefined
 * @param {any} value
 * @returns {boolean}
 */
export const isUndefined = (value) => value === undefined;

/**
 * Vérifier si c'est null ou undefined
 * @param {any} value
 * @returns {boolean}
 */
export const isNullOrUndefined = (value) => value === null || value === undefined;

/**
 * Vérifier si c'est défini (ni null ni undefined)
 * @param {any} value
 * @returns {boolean}
 */
export const isDefined = (value) => value !== null && value !== undefined;

/**
 * Vérifier si c'est une fonction
 * @param {any} value
 * @returns {boolean}
 */
export const isFunction = (value) => typeof value === 'function';

/**
 * Vérifier si c'est une Date
 * @param {any} value
 * @returns {boolean}
 */
export const isDate = (value) => value instanceof Date && !Number.isNaN(value.getTime());

/**
 * Vérifier si c'est une string vide
 * @param {any} value
 * @returns {boolean}
 */
export const isEmptyString = (value) => {
  return typeof value === 'string' && value.trim().length === 0;
};

/**
 * Vérifier si c'est une valeur vide (null, undefined, '', [], {})
 * @param {any} value
 * @returns {boolean}
 */
export const isEmptyValue = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Vérifier si c'est un email valide
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email);
};

/**
 * Vérifier si c'est une URL valide
 * @param {string} url
 * @returns {boolean}
 */
export const isValidUrl = (url) => {
  if (typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Vérifier si c'est un UUID
 * @param {string} value
 * @returns {boolean}
 */
export const isUUID = (value) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return typeof value === 'string' && uuidRegex.test(value);
};

/**
 * Vérifier si c'est un JSON valide
 * @param {string} json
 * @returns {boolean}
 */
export const isValidJSON = (json) => {
  if (typeof json !== 'string') return false;
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
};

/**
 * Vérifier si c'est un numéro de téléphone valide (format simple)
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return typeof phone === 'string' && phoneRegex.test(phone);
};

export default {
  getType,
  isString,
  isNumber,
  isBoolean,
  isArray,
  isObject,
  isNull,
  isUndefined,
  isNullOrUndefined,
  isDefined,
  isFunction,
  isDate,
  isEmptyString,
  isEmptyValue,
  isValidEmail,
  isValidUrl,
  isUUID,
  isValidJSON,
  isValidPhone,
};
