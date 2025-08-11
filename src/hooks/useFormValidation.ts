"use client";

import { useCallback, useState } from "react";
import { validateForm } from "@/helpers/validationForm";

type FieldName = "urlEasyPanel" | "contactId" | "locationId" | "emailTester";

export interface UseFormValidationState {
  fieldErrors: Partial<Record<FieldName, string>>;
}

export interface UseFormValidationActions {
  validate: (fields: { urlEasyPanel: string; contactId: string; locationId: string; emailTester: string; }) => {
    isValid: boolean;
    errors: string[];
  };
  clearErrors: () => void;
  setError: (field: FieldName, error: string) => void;
}

export function useFormValidation(): UseFormValidationState & UseFormValidationActions {
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({});

  const validate = useCallback((fields: { urlEasyPanel: string; contactId: string; locationId: string; emailTester: string; }) => {
    const { isValid, errors, fields: fieldErrs } = validateForm(
      fields.urlEasyPanel,
      fields.contactId,
      fields.locationId,
      fields.emailTester
    );
    setFieldErrors(fieldErrs);
    return { isValid, errors };
  }, []);

  const clearErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  const setError = useCallback((field: FieldName, error: string) => {
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  return { fieldErrors, validate, clearErrors, setError };
}


