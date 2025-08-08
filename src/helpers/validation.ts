/**
 * Funciones helper para validación de inputs
 */

/**
 * Valida si una cadena es una URL válida
 * @param url - Cadena URL a validar
 * @returns True si es URL válida, false en caso contrario
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valida si una cadena es un email válido
 * @param email - Cadena email a validar
 * @returns True si es email válido, false en caso contrario
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida si una cadena no está vacía
 * @param value - Cadena a validar
 * @returns True si no está vacía, false en caso contrario
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Valida todos los inputs del formulario
 * @param urlEasyPanel - Valor del input URL
 * @param contactId - Valor del input Contact ID
 * @param locationId - Valor del input Location ID
 * @param emailTester - Valor del input Email
 * @returns Objeto con resultados de validación
 */
export function validateForm(
  urlEasyPanel: string,
  contactId: string,
  locationId: string,
  emailTester: string
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!isNotEmpty(urlEasyPanel)) {
    errors.push("URL EasyPanel es requerida");
  } else if (!isValidUrl(urlEasyPanel)) {
    errors.push("URL EasyPanel debe ser una URL válida");
  }

  if (!isNotEmpty(contactId)) {
    errors.push("Contact ID es requerido");
  }

  if (!isNotEmpty(locationId)) {
    errors.push("Location ID es requerido");
  }

  if (!isNotEmpty(emailTester)) {
    errors.push("Email Tester es requerido");
  } else if (!isValidEmail(emailTester)) {
    errors.push("Email Tester debe ser un email válido");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
