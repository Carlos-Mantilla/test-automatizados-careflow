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
  fields: Partial<Record<"urlEasyPanel" | "contactId" | "locationId" | "emailTester", string>>;
} {
  const errors: string[] = [];
  const fields: Partial<Record<
    "urlEasyPanel" | "contactId" | "locationId" | "emailTester",
    string
  >> = {};

  if (!isNotEmpty(urlEasyPanel)) {
    const msg = "URL EasyPanel es requerida";
    errors.push(msg);
    fields.urlEasyPanel = msg;
  } else if (!isValidUrl(urlEasyPanel)) {
    const msg = "URL EasyPanel debe ser una URL válida";
    errors.push(msg);
    fields.urlEasyPanel = msg;
  }

  if (!isNotEmpty(contactId)) {
    const msg = "Contact ID es requerido";
    errors.push(msg);
    fields.contactId = msg;
  }

  if (!isNotEmpty(locationId)) {
    const msg = "Location ID es requerido";
    errors.push(msg);
    fields.locationId = msg;
  }

  if (!isNotEmpty(emailTester)) {
    const msg = "Email Tester es requerido";
    errors.push(msg);
    fields.emailTester = msg;
  } else if (!isValidEmail(emailTester)) {
    const msg = "Email Tester debe ser un email válido";
    errors.push(msg);
    fields.emailTester = msg;
  }

  return {
    isValid: errors.length === 0,
    errors,
    fields,
  };
}
