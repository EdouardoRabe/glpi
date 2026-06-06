// Fonctions de comparaison pour dates, nombres, textes

/**
 * Comparaison d'années entre deux dates
 * @param {Date|string} date1
 * @param {Date|string} date2
 * @returns {number} -1 si date1 < date2, 0 si égal, 1 si date1 > date2
 */
export const compareYears = (date1, date2) => {
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);

  if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) {
    return 0;
  }

  const y1 = d1.getFullYear();
  const y2 = d2.getFullYear();

  if (y1 < y2) return -1;
  if (y1 > y2) return 1;
  return 0;
};

/**
 * Comparaison de mois entre deux dates (même année)
 * @param {Date|string} date1
 * @param {Date|string} date2
 * @returns {number} -1 si date1 < date2, 0 si égal, 1 si date1 > date2
 */
export const compareMonths = (date1, date2) => {
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);

  if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) {
    return 0;
  }

  const m1 = d1.getMonth() + 1;
  const m2 = d2.getMonth() + 1;

  if (m1 < m2) return -1;
  if (m1 > m2) return 1;
  return 0;
};

/**
 * Comparaison de jours entre deux dates
 * @param {Date|string} date1
 * @param {Date|string} date2
 * @returns {number} -1 si date1 < date2, 0 si égal, 1 si date1 > date2
 */
export const compareDays = (date1, date2) => {
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);

  if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) {
    return 0;
  }

  const day1 = d1.getDate();
  const day2 = d2.getDate();

  if (day1 < day2) return -1;
  if (day1 > day2) return 1;
  return 0;
};

/**
 * Comparaison complète de deux dates
 * @param {Date|string} date1
 * @param {Date|string} date2
 * @returns {number} -1 si date1 < date2, 0 si égal, 1 si date1 > date2
 */
export const compareDates = (date1, date2) => {
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);

  console.log("date ticket ", d1, "date ", d2);

  if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) {
    return 0;
  }

  if (d1.getTime() < d2.getTime()) return -1;
  if (d1.getTime() > d2.getTime()) return 1;
  return 0;
};

/**
 * Comparaison de deux nombres
 * @param {number} num1
 * @param {number} num2
 * @returns {number} -1 si num1 < num2, 0 si égal, 1 si num1 > num2
 */
export const compareNumbers = (num1, num2) => {
  const n1 = Number(num1) || 0;
  const n2 = Number(num2) || 0;

  if (n1 < n2) return -1;
  if (n1 > n2) return 1;
  return 0;
};

/**
 * Comparaison simple de deux textes (cas sensitive)
 * @param {string} text1
 * @param {string} text2
 * @returns {number} -1 si text1 < text2, 0 si égal, 1 si text1 > text2
 */
export const compareTexts = (text1, text2) => {
  const t1 = String(text1 || '').trim();
  const t2 = String(text2 || '').trim();

  if (t1 < t2) return -1;
  if (t1 > t2) return 1;
  return 0;
};

/**
 * Comparaison de deux textes (case insensitive)
 * @param {string} text1
 * @param {string} text2
 * @returns {number} -1 si text1 < text2, 0 si égal, 1 si text1 > text2
 */
export const compareTextsIgnoreCase = (text1, text2) => {
  const t1 = String(text1 || '').trim().toLowerCase();
  const t2 = String(text2 || '').trim().toLowerCase();

  if (t1 < t2) return -1;
  if (t1 > t2) return 1;
  return 0;
};

/**
 * Récuperer le mois d'une date (1-12)
 * @param {Date|string} date
 * @returns {number}
 */
export const getMonth = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return 0;
  return d.getMonth() + 1;
};

/**
 * Récuperer le jour d'une date (1-31)
 * @param {Date|string} date
 * @returns {number}
 */
export const getDay = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return 0;
  return d.getDate();
};

/**
 * Récuperer l'année d'une date
 * @param {Date|string} date
 * @returns {number}
 */
export const getYear = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return 0;
  return d.getFullYear();
};

/**
 * Splitter une date en composants {year, month, day, hours, minutes, seconds}
 * @param {Date|string} date
 * @returns {object}
 */
export const splitDate = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) {
    return { year: 0, month: 0, day: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    hours: d.getHours(),
    minutes: d.getMinutes(),
    seconds: d.getSeconds(),
    milliseconds: d.getMilliseconds(),
  };
};

/**
 * Vérifier si deux dates sont identiques
 * @param {Date|string} date1
 * @param {Date|string} date2
 * @returns {boolean}
 */
export const areDatesEqual = (date1, date2) => {
  return compareDates(date1, date2) === 0;
};

/**
 * Vérifier si deux textes sont identiques (case insensitive)
 * @param {string} text1
 * @param {string} text2
 * @returns {boolean}
 */
export const areTextsEqual = (text1, text2) => {
  return compareTexts(text1, text2) === 0;
};

/**
 * Vérifier si deux textes sont identiques (case insensitive)
 * @param {string} text1
 * @param {string} text2
 * @returns {boolean}
 */
export const areTextsEqualIgnoreCase = (text1, text2) => {
  return compareTextsIgnoreCase(text1, text2) === 0;
};

export default {
  compareYears,
  compareMonths,
  compareDays,
  compareDates,
  compareNumbers,
  compareTexts,
  compareTextsIgnoreCase,
  getMonth,
  getDay,
  getYear,
  splitDate,
  areDatesEqual,
  areTextsEqual,
  areTextsEqualIgnoreCase,
};
