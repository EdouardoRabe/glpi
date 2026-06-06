// Fonctions utilitaires pour les nombres

/**
 * Vérifier si c'est un nombre valide
 * @param {any} value
 * @returns {boolean}
 */
export const isValidNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num);
};

/**
 * Vérifier si c'est un nombre pair
 * @param {number} num
 * @returns {boolean}
 */
export const isEven = (num) => {
  const n = Number(num) || 0;
  return n % 2 === 0;
};

/**
 * Vérifier si c'est un nombre impair
 * @param {number} num
 * @returns {boolean}
 */
export const isOdd = (num) => {
  const n = Number(num) || 0;
  return n % 2 !== 0;
};

/**
 * Vérifier si c'est un nombre positif
 * @param {number} num
 * @returns {boolean}
 */
export const isPositive = (num) => {
  const n = Number(num) || 0;
  return n > 0;
};

/**
 * Vérifier si c'est un nombre négatif
 * @param {number} num
 * @returns {boolean}
 */
export const isNegative = (num) => {
  const n = Number(num) || 0;
  return n < 0;
};

/**
 * Vérifier si c'est zéro
 * @param {number} num
 * @returns {boolean}
 */
export const isZero = (num) => {
  const n = Number(num) || 0;
  return n === 0;
};

/**
 * Vérifier si c'est un nombre entier
 * @param {number} num
 * @returns {boolean}
 */
export const isInteger = (num) => {
  const n = Number(num);
  return Number.isInteger(n);
};

/**
 * Vérifier si c'est un nombre premier
 * @param {number} num
 * @returns {boolean}
 */
export const isPrime = (num) => {
  const n = Math.floor(Number(num) || 0);
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;

  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
};

/**
 * Obtenir la valeur absolue
 * @param {number} num
 * @returns {number}
 */
export const abs = (num) => Math.abs(Number(num) || 0);

/**
 * Arrondissement
 * @param {number} num
 * @param {number} decimals
 * @returns {number}
 */
export const round = (num, decimals = 0) => {
  const n = Number(num) || 0;
  const factor = Math.pow(10, decimals);
  return Math.round(n * factor) / factor;
};

/**
 * Arrondir vers le haut
 * @param {number} num
 * @returns {number}
 */
export const ceil = (num) => Math.ceil(Number(num) || 0);

/**
 * Arrondir vers le bas
 * @param {number} num
 * @returns {number}
 */
export const floor = (num) => Math.floor(Number(num) || 0);

/**
 * Limiter un nombre entre min et max
 * @param {number} num
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const clamp = (num, min, max) => {
  const n = Number(num) || 0;
  const minVal = Number(min) || 0;
  const maxVal = Number(max) || 0;
  return Math.max(minVal, Math.min(n, maxVal));
};

/**
 * Calculer un pourcentage
 * @param {number} value - la valeur
 * @param {number} total - le total
 * @param {number} decimals - nombre de décimales
 * @returns {number}
 */
export const percentage = (value, total, decimals = 2) => {
  const val = Number(value) || 0;
  const tot = Number(total) || 0;

  if (tot === 0) return 0;
  return round((val / tot) * 100, decimals);
};

/**
 * Calculer un pourcentage inverse (valeur à partir du pourcentage)
 * @param {number} percent - le pourcentage
 * @param {number} total - le total
 * @returns {number}
 */
export const percentageValue = (percent, total) => {
  const p = Number(percent) || 0;
  const t = Number(total) || 0;
  return (p / 100) * t;
};

/**
 * Puissance
 * @param {number} base
 * @param {number} exponent
 * @returns {number}
 */
export const power = (base, exponent) => {
  const b = Number(base) || 0;
  const e = Number(exponent) || 0;
  return Math.pow(b, e);
};

/**
 * Racine carrée
 * @param {number} num
 * @returns {number}
 */
export const sqrt = (num) => Math.sqrt(Number(num) || 0);

/**
 * Factorielle
 * @param {number} num
 * @returns {number}
 */
export const factorial = (num) => {
  const n = Math.floor(Number(num) || 0);
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;

  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

/**
 * PGCD (Plus Grand Commun Diviseur)
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export const gcd = (a, b) => {
  let x = Math.floor(Number(a) || 0);
  let y = Math.floor(Number(b) || 0);

  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x;
};

/**
 * PPCM (Plus Petit Commun Multiple)
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export const lcm = (a, b) => {
  const x = Math.floor(Number(a) || 0);
  const y = Math.floor(Number(b) || 0);

  if (x === 0 || y === 0) return 0;
  return Math.abs((x * y) / gcd(x, y));
};

/**
 * Formater un nombre en chaîne avec séparateurs
 * @param {number} num
 * @param {number} decimals
 * @param {string} decimalSep
 * @param {string} thousandsSep
 * @returns {string}
 */
export const formatNumber = (num, decimals = 0, decimalSep = ',', thousandsSep = ' ') => {
  const n = Number(num) || 0;
  const parts = round(n, decimals).toString().split('.');

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);

  if (decimals > 0 && !parts[1]) {
    parts[1] = '0'.repeat(decimals);
  }

  return parts.length === 2 ? parts.join(decimalSep) : parts[0];
};

export default {
  isValidNumber,
  isEven,
  isOdd,
  isPositive,
  isNegative,
  isZero,
  isInteger,
  isPrime,
  abs,
  round,
  ceil,
  floor,
  clamp,
  percentage,
  percentageValue,
  power,
  sqrt,
  factorial,
  gcd,
  lcm,
  formatNumber,
};
