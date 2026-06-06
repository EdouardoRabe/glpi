// Fonctions utilitaires pour les objets

/**
 * Vérifier si un objet est vide
 * @param {object} obj
 * @returns {boolean}
 */
export const isEmpty = (obj) => {
  if (!obj || typeof obj !== 'object') return true;
  return Object.keys(obj).length === 0;
};

/**
 * Vérifier si un objet a une propriété
 * @param {object} obj
 * @param {string} key
 * @returns {boolean}
 */
export const hasProperty = (obj, key) => {
  if (!obj || typeof obj !== 'object') return false;
  return key in obj;
};

/**
 * Vérifier si un objet a toutes les propriétés
 * @param {object} obj
 * @param {array} keys
 * @returns {boolean}
 */
export const hasProperties = (obj, keys) => {
  if (!obj || typeof obj !== 'object' || !Array.isArray(keys)) return false;
  return keys.every((key) => key in obj);
};

/**
 * Obtenir une propriété avec accès profond (obj.prop.subprop)
 * @param {object} obj
 * @param {string} path - 'prop.subprop.value'
 * @param {any} defaultValue
 * @returns {any}
 */
export const getDeepProperty = (obj, path, defaultValue = undefined) => {
  if (!obj || typeof obj !== 'object' || typeof path !== 'string') return defaultValue;

  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return defaultValue;
    }
  }

  return current;
};

/**
 * Obtenir les clés d'un objet
 * @param {object} obj
 * @returns {array}
 */
export const keys = (obj) => {
  if (!obj || typeof obj !== 'object') return [];
  return Object.keys(obj);
};

/**
 * Obtenir les valeurs d'un objet
 * @param {object} obj
 * @returns {array}
 */
export const values = (obj) => {
  if (!obj || typeof obj !== 'object') return [];
  return Object.values(obj);
};

/**
 * Obtenir les entries d'un objet [key, value]
 * @param {object} obj
 * @returns {array}
 */
export const entries = (obj) => {
  if (!obj || typeof obj !== 'object') return [];
  return Object.entries(obj);
};

/**
 * Fusionner deux objets
 * @param {object} obj1
 * @param {object} obj2
 * @returns {object}
 */
export const merge = (obj1, obj2) => {
  if (typeof obj1 !== 'object' || obj1 === null) return obj2 || {};
  if (typeof obj2 !== 'object' || obj2 === null) return obj1 || {};
  return { ...obj1, ...obj2 };
};

/**
 * Fusionner plusieurs objets
 * @param {array} objects
 * @returns {object}
 */
export const mergeMultiple = (objects) => {
  if (!Array.isArray(objects)) return {};
  return objects.reduce((acc, obj) => merge(acc, obj), {});
};

/**
 * Cloner un objet (shallow)
 * @param {object} obj
 * @returns {object}
 */
export const clone = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return [...obj];
  return { ...obj };
};

/**
 * Cloner un objet profondément (deep)
 * @param {object} obj
 * @returns {object}
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item));
  }

  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }

  return obj;
};

/**
 * Vérifier si deux objets sont égaux (shallow)
 * @param {object} obj1
 * @param {object} obj2
 * @returns {boolean}
 */
export const equals = (obj1, obj2) => {
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return obj1 === obj2;
  if (obj1 === null || obj2 === null) return obj1 === obj2;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => obj1[key] === obj2[key]);
};

/**
 * Inverser un objet (clés ↔ valeurs)
 * @param {object} obj
 * @returns {object}
 */
export const invert = (obj) => {
  if (typeof obj !== 'object' || obj === null) return {};

  const inverted = {};
  for (const [key, value] of Object.entries(obj)) {
    inverted[value] = key;
  }
  return inverted;
};

/**
 * Filtrer un objet par les clés
 * @param {object} obj
 * @param {string|array} keys - Une clé ou un array de clés
 * @returns {object}
 */
export const pick = (obj, keys) => {
  if (typeof obj !== 'object' || obj === null) return {};

  const keysArray = Array.isArray(keys) ? keys : [keys];
  const picked = {};

  keysArray.forEach((key) => {
    if (key in obj) {
      picked[key] = obj[key];
    }
  });

  return picked;
};

/**
 * Exclure des clés d'un objet
 * @param {object} obj
 * @param {string|array} keys
 * @returns {object}
 */
export const omit = (obj, keys) => {
  if (typeof obj !== 'object' || obj === null) return {};

  const keysToOmit = Array.isArray(keys) ? keys : [keys];
  const result = { ...obj };

  keysToOmit.forEach((key) => {
    delete result[key];
  });

  return result;
};

/**
 * Mapper un objet (transformer les valeurs)
 * @param {object} obj
 * @param {function} fn
 * @returns {object}
 */
export const mapValues = (obj, fn) => {
  if (typeof obj !== 'object' || obj === null || typeof fn !== 'function') return {};

  const mapped = {};
  for (const [key, value] of Object.entries(obj)) {
    mapped[key] = fn(value, key);
  }
  return mapped;
};

export default {
  isEmpty,
  hasProperty,
  hasProperties,
  getDeepProperty,
  keys,
  values,
  entries,
  merge,
  mergeMultiple,
  clone,
  deepClone,
  equals,
  invert,
  pick,
  omit,
  mapValues,
};
