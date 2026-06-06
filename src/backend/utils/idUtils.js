// Utils pour extraire proprement un identifiant depuis des formes variées
export const extractId = (obj) => {
  if (!obj) return undefined;
  // Si possède une propriété id
  if (obj.id !== undefined && obj.id !== null) {
    const idVal = obj.id;
    if (typeof idVal === 'object') {
      return idVal.value ?? idVal['#text'] ?? undefined;
    }
    return idVal;
  }

  if (obj['#text'] !== undefined) return obj['#text'];
  if (obj.value !== undefined) return obj.value;
  if (obj['@_id'] !== undefined) return obj['@_id'];
  return undefined;
};

export default {
  extractId,
};
