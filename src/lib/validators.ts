export const validatePhone = (phone: string): { valid: boolean; formatted: string; error?: string } => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 0) {
    return { valid: false, formatted: '8', error: 'Номер телефона не может быть пустым' };
  }

  // If it starts with 7, replace with 8
  let normalized = digits.startsWith('7') ? '8' + digits.slice(1) : digits;

  // If it doesn't start with 8, prepend 8
  if (!normalized.startsWith('8')) {
    normalized = '8' + normalized;
  }

  // Trim to 11 digits
  normalized = normalized.slice(0, 11);

  if (normalized.length !== 11) {
    return { valid: false, formatted: normalized, error: 'Номер должен содержать 10 цифр (11 с кодом)' };
  }

  return { valid: true, formatted: normalized };
};

export const formatPhoneDisplay = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length !== 11) return phone;

  // Format: 8 (XXX) XXX-XX-XX
  return `${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
};

export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  const trimmed = email.trim();

  if (!trimmed) {
    return { valid: false, error: 'Email не может быть пустым' };
  }

  // Check for @ symbol
  if (!trimmed.includes('@')) {
    return { valid: false, error: 'Email должен содержать символ @' };
  }

  const [localPart, domain] = trimmed.split('@');

  // Check if both parts exist
  if (!localPart || !domain) {
    return { valid: false, error: 'Email должен быть в формате: user@domain.com' };
  }

  // Check for at least one dot in domain
  if (!domain.includes('.')) {
    return { valid: false, error: 'Email должен содержать точку после @' };
  }

  // Check for valid characters (no spaces, no Cyrillic, only @, ., -, _)
  const validEmailRegex = /^[a-zA-Z0-9._\-]+@[a-zA-Z0-9._\-]+\.[a-zA-Z]{2,}$/;
  if (!validEmailRegex.test(trimmed)) {
    return { valid: false, error: 'Email содержит недопустимые символы. Допускаются только латиница, цифры, @, ., -, _' };
  }

  // Check for consecutive dots
  if (trimmed.includes('..')) {
    return { valid: false, error: 'Email не может содержать две точки подряд' };
  }

  // Check that local part and domain don't start with dot or hyphen
  if (localPart.startsWith('.') || localPart.startsWith('-')) {
    return { valid: false, error: 'Часть перед @ не может начинаться с точки или дефиса' };
  }

  if (domain.startsWith('.') || domain.startsWith('-')) {
    return { valid: false, error: 'Домен не может начинаться с точки или дефиса' };
  }

  return { valid: true };
};

export const validateName = (name: string): { valid: boolean; error?: string } => {
  const trimmed = name.trim();

  if (!trimmed) {
    return { valid: false, error: 'Имя не может быть пустым' };
  }

  if (trimmed.length < 2) {
    return { valid: false, error: 'Имя должно содержать минимум 2 символа' };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'Имя не должно превышать 100 символов' };
  }

  return { valid: true };
};

export const validateAddress = (address: string): { valid: boolean; error?: string } => {
  const trimmed = address.trim();

  if (!trimmed) {
    return { valid: false, error: 'Адрес не может быть пустым' };
  }

  if (trimmed.length < 5) {
    return { valid: false, error: 'Адрес должен содержать минимум 5 символов' };
  }

  if (trimmed.length > 255) {
    return { valid: false, error: 'Адрес не должен превышать 255 символов' };
  }

  return { valid: true };
};
