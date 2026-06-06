// Fonctions utilitaires pour manipuler les arrays

/**
 * Vérifier si un array est vide
 * @param {array} arr
 * @returns {boolean}
 */
export const isEmpty = (arr) => !Array.isArray(arr) || arr.length === 0;

/**
 * Vérifier si un array contient une valeur
 * @param {array} arr
 * @param {any} value
 * @returns {boolean}
 */
export const contains = (arr, value) => {
  if (!Array.isArray(arr)) return false;
  return arr.includes(value);
};

/**
 * Obtenir l'index d'une valeur
 * @param {array} arr
 * @param {any} value
 * @returns {number}
 */
export const indexOf = (arr, value) => {
  if (!Array.isArray(arr)) return -1;
  return arr.indexOf(value);
};

/**
 * Obtenir les éléments uniques (supprimer doublons)
 * @param {array} arr
 * @returns {array}
 */
export const unique = (arr) => {
  if (!Array.isArray(arr)) return [];
  return [...new Set(arr)];
};

/**
 * Trouver les doublons dans un array
 * @param {array} arr
 * @returns {array}
 */
export const findDuplicates = (arr) => {
  if (!Array.isArray(arr)) return [];
  const seen = new Set();
  const duplicates = new Set();

  arr.forEach((item) => {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  });

  return [...duplicates];
};

/**
 * Grouper les éléments d'un array par une propriété
 * @param {array} arr
 * @param {string|function} keyOrFn - propriété ou fonction
 * @returns {object}
 */
export const groupBy = (arr, keyOrFn) => {
  if (!Array.isArray(arr)) return {};

  const isFunction = typeof keyOrFn === 'function';
  const grouped = {};

  arr.forEach((item) => {
    const key = isFunction ? keyOrFn(item) : item[keyOrFn];
    const keyStr = String(key || 'undefined');

    if (!grouped[keyStr]) {
      grouped[keyStr] = [];
    }
    grouped[keyStr].push(item);
  });

  return grouped;
};

/**
 * Aplatir un array multidimensionnel
 * @param {array} arr
 * @param {number} depth
 * @returns {array}
 */
export const flatten = (arr, depth = 1) => {
  if (!Array.isArray(arr)) return [];
  return arr.flat(depth);
};

/**
 * Diviser un array en chunks
 * @param {array} arr
 * @param {number} size
 * @returns {array}
 */
export const chunk = (arr, size) => {
  if (!Array.isArray(arr) || size <= 0) return [];

  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/**
 * Intersection de deux arrays
 * @param {array} arr1
 * @param {array} arr2
 * @returns {array}
 */
export const intersection = (arr1, arr2) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return [];
  return arr1.filter((item) => arr2.includes(item));
};

/**
 * Union de deux arrays
 * @param {array} arr1
 * @param {array} arr2
 * @returns {array}
 */
export const union = (arr1, arr2) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return [];
  return unique([...arr1, ...arr2]);
};

/**
 * Différence entre deux arrays
 * @param {array} arr1
 * @param {array} arr2
 * @returns {array}
 */
export const difference = (arr1, arr2) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return [];
  return arr1.filter((item) => !arr2.includes(item));
};

/**
 * Trouver le max d'un array
 * @param {array} arr
 * @returns {any}
 */
export const max = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return Math.max(...arr.filter(v => typeof v === 'number'));
};

/**
 * Trouver le min d'un array
 * @param {array} arr
 * @returns {any}
 */
export const min = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return Math.min(...arr.filter(v => typeof v === 'number'));
};

/**
 * Calculer la somme d'un array
 * @param {array} arr
 * @returns {number}
 */
export const sum = (arr) => {
  if (!Array.isArray(arr)) return 0;
  return arr.reduce((total, val) => {
    const num = Number(val) || 0;
    return total + num;
  }, 0);
};

/**
 * Calculer la moyenne d'un array
 * @param {array} arr
 * @returns {number}
 */
export const average = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  return sum(arr) / arr.length;
};

/**
 * Inverser un array
 * @param {array} arr
 * @returns {array}
 */
export const reverse = (arr) => {
  if (!Array.isArray(arr)) return [];
  return [...arr].reverse();
};

/**
 * Récupérer le premier élément
 * @param {array} arr
 * @returns {any}
 */
export const first = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return undefined;
  return arr[0];
};

/**
 * Récupérer le dernier élément
 * @param {array} arr
 * @returns {any}
 */
export const last = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return undefined;
  return arr[arr.length - 1];
};

/**
 * Mélanger les éléments d'un array
 * @param {array} arr
 * @returns {array}
 */
export const shuffle = (arr) => {
  if (!Array.isArray(arr)) return [];

  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Récupérer un élément aléatoire
 * @param {array} arr
 * @returns {any}
 */
export const randomElement = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
};

export default {
  isEmpty,
  contains,
  indexOf,
  unique,
  findDuplicates,
  groupBy,
  flatten,
  chunk,
  intersection,
  union,
  difference,
  max,
  min,
  sum,
  average,
  reverse,
  first,
  last,
  shuffle,
  randomElement,
};
