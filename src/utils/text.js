export function sanitizeText(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

export function fallbackText(value, emptyValue = "--") {
  const sanitized = sanitizeText(value);
  return sanitized ? sanitized : emptyValue;
}
