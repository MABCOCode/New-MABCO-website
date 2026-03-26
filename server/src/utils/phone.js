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

module.exports = {
  normalizePhone,
};
