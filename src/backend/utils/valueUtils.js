export const getPrimitiveValue = (value) => {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed && trimmed.length > 0 ? trimmed : '';
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value).trim();
  }

  if (typeof value === 'object') {
    if (typeof value['#text'] === 'string') return value['#text'].trim();
    if (typeof value.value === 'string') return value.value.trim();
    if (typeof value.text === 'string') return value.text.trim();
    if (typeof value._text === 'string') return value._text.trim();

    if (value.language) {
      return getPrimitiveValue(value.language);
    }

    if (Array.isArray(value) && value.length > 0) {
      return getPrimitiveValue(value[0]);
    }

    const keys = Object.keys(value).filter(
      (k) => !k.includes('id') && !k.includes('href') && k !== 'url',
    );

    for (const key of keys) {
      const val = getPrimitiveValue(value[key]);
      if (val && val.length > 0) {
        return val;
      }
    }

    return '';
  }

  return '';
};

export const roundDecimal = (value, decimals = 6) => {
  const num = Number.parseFloat(value) || 0;
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};

export const parseRateFromLabel = (label) => {
  const text = String(label || '').trim();
  if (!text) {
    return null;
  }

  const match = text.match(/(\d+(?:[\.,]\d+)?)/);
  if (!match) {
    return null;
  }

  const parsed = Number.parseFloat(match[1].replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
};
