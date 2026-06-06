// Fonctions utilitaires pour la validation

/**
 * Valider un email
 * @param {string} email
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && email.trim().length > 0 && emailRegex.test(email);
};

/**
 * Valider une URL
 * @param {string} url
 * @returns {boolean}
 */
export const validateUrl = (url) => {
  if (typeof url !== 'string' || url.trim().length === 0) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Valider une date
 * @param {string|Date} date
 * @returns {boolean}
 */
export const validateDate = (date) => {
  if (date instanceof Date) {
    return !Number.isNaN(date.getTime());
  }

  if (typeof date === 'string') {
    const parsed = new Date(date);
    return !Number.isNaN(parsed.getTime());
  }

  return false;
};

/**
 * Valider un numéro
 * @param {any} value
 * @returns {boolean}
 */
export const validateNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num);
};

/**
 * Valider un nombre entier
 * @param {any} value
 * @returns {boolean}
 */
export const validateInteger = (value) => {
  const num = Number(value);
  return Number.isInteger(num);
};

/**
 * Valider que c'est un entier positif ou zéro
 * @param {any} value
 * @returns {boolean}
 */
export const validateNonNegativeInteger = (value) => {
  const num = Number(value);
  return Number.isInteger(num) && num >= 0;
};

/**
 * Valider un numéro de téléphone
 * @param {string} phone
 * @returns {boolean}
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return typeof phone === 'string' && phone.trim().length > 0 && phoneRegex.test(phone);
};

/**
 * Valider la longueur d'une string
 * @param {string} value
 * @param {number} minLength
 * @param {number} maxLength
 * @returns {boolean}
 */
export const validateLength = (value, minLength = 0, maxLength = Infinity) => {
  if (typeof value !== 'string') return false;

  const len = value.trim().length;
  return len >= minLength && len <= maxLength;
};

/**
 * Valider que c'est un mot de passe fort
 * Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
 * @param {string} password
 * @returns {boolean}
 */
export const validateStrongPassword = (password) => {
  if (typeof password !== 'string' || password.length < 8) return false;

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
};

/**
 * Valider que c'est un mot de passe moyen (au moins 6 caractères et 1 chiffre)
 * @param {string} password
 * @returns {boolean}
 */
export const validateMediumPassword = (password) => {
  if (typeof password !== 'string' || password.length < 6) return false;

  const hasNumber = /[0-9]/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);

  return hasNumber && hasLetter;
};

/**
 * Valider un UUID
 * @param {string} value
 * @returns {boolean}
 */
export const validateUUID = (value) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return typeof value === 'string' && uuidRegex.test(value);
};

/**
 * Valider un code postal français
 * @param {string} code
 * @returns {boolean}
 */
export const validateFrenchZipCode = (code) => {
  const zipRegex = /^[0-9]{5}$/;
  return typeof code === 'string' && zipRegex.test(code);
};

/**
 * Valider un numéro SIRET français
 * @param {string} siret
 * @returns {boolean}
 */
export const validateFrenchSIRET = (siret) => {
  const siretRegex = /^[0-9]{14}$/;
  return typeof siret === 'string' && siretRegex.test(siret);
};

/**
 * Valider une valeur contre une regex
 * @param {string} value
 * @param {string|RegExp} pattern
 * @returns {boolean}
 */
export const validatePattern = (value, pattern) => {
  if (typeof value !== 'string') return false;

  try {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    return regex.test(value);
  } catch {
    return false;
  }
};

/**
 * Valider qu'une valeur est dans une liste
 * @param {any} value
 * @param {array} allowedValues
 * @returns {boolean}
 */
export const validateInList = (value, allowedValues) => {
  if (!Array.isArray(allowedValues)) return false;
  return allowedValues.includes(value);
};

/**
 * Valider qu'un objet a les propriétés requises
 * @param {object} obj
 * @param {array} requiredKeys
 * @returns {boolean}
 */
export const validateRequiredProperties = (obj, requiredKeys) => {
  if (typeof obj !== 'object' || obj === null || !Array.isArray(requiredKeys)) return false;

  return requiredKeys.every((key) => {
    const value = obj[key];
    return value !== null && value !== undefined && value !== '';
  });
};

export default {
  validateEmail,
  validateUrl,
  validateDate,
  validateNumber,
  validateInteger,
  validateNonNegativeInteger,
  validatePhone,
  validateLength,
  validateStrongPassword,
  validateMediumPassword,
  validateUUID,
  validateFrenchZipCode,
  validateFrenchSIRET,
  validatePattern,
  validateInList,
  validateRequiredProperties,
};
