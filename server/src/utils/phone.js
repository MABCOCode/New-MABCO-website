function normalizePhone(raw) {
  if (!raw) return '';
  let digits = String(raw).replace(/[^0-9]/g, '');

  if (digits.startsWith('00963')) {
    digits = `0${digits.slice(4)}`;
  } else if (digits.startsWith('963')) {
    digits = `0${digits.slice(3)}`;
  } else if (digits.startsWith('9') && digits.length === 9) {
    digits = `0${digits}`;
  }

  return digits;
}

function to963Phone(raw) {
  const normalized = normalizePhone(raw);
  if (!normalized) return '';
  if (normalized.startsWith('0')) {
    return `963${normalized.slice(1)}`;
  }
  if (normalized.startsWith('963')) return normalized;
  return normalized;
}

function phoneVariants(raw) {
  const normalized = normalizePhone(raw);
  if (!normalized) return [];
  const with963 = to963Phone(normalized);
  const variants = new Set([normalized, with963]);
  return Array.from(variants).filter(Boolean);
}

module.exports = {
  normalizePhone,
  to963Phone,
  phoneVariants,
};
