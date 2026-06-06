export function cleanRut(value) {
  return String(value || "")
    .replace(/\./g, "")
    .replace(/-/g, "")
    .replace(/[^0-9kK]/g, "")
    .toUpperCase();
}

export function formatRut(value) {
  const cleaned = cleanRut(value);

  if (cleaned.length <= 1) {
    return cleaned;
  }

  const body = cleaned.slice(0, -1);
  const verifier = cleaned.slice(-1);
  const reversedBody = body.split("").reverse();
  const groups = [];

  for (let index = 0; index < reversedBody.length; index += 3) {
    groups.push(reversedBody.slice(index, index + 3).reverse().join(""));
  }

  return `${groups.reverse().join(".")}-${verifier}`;
}

export function isValidRut(value) {
  const cleaned = cleanRut(value);

  if (cleaned.length < 8) {
    return false;
  }

  const body = cleaned.slice(0, -1);
  const verifier = cleaned.slice(-1);
  let sum = 0;
  let multiplier = 2;

  for (let index = body.length - 1; index >= 0; index -= 1) {
    sum += Number(body[index]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  const expectedVerifier = remainder === 11 ? "0" : remainder === 10 ? "K" : String(remainder);

  return expectedVerifier === verifier;
}

export function normalizeRutForQuery(value) {
  return cleanRut(value);
}
