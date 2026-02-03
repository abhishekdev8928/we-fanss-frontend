import { ZodError } from "zod";

/**
 * Validate data using Zod safeParse (Frontend Friendly)
 * @param {ZodSchema} schema
 * @param {Object} data
 * @returns {{
 *   success: boolean,
 *   data: any | null,
 *   errors: Record<string, string> | null
 * }}
 */
export const validateForm = (schema, data) => {
  // ✅ Check if schema exists
  if (!schema || typeof schema.safeParse !== 'function') {
    console.error("Invalid schema provided to validateForm");
    return {
      success: false,
      data: null,
      errors: { _error: "Validation schema is missing or invalid" },
    };
  }

  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
      errors: null,
    };
  }

  // ✅ Format errors for UI with proper Zod error handling
  const formattedErrors = {};
  
  // ✅ Zod errors are in result.error.issues (not result.error.errors)
  if (result.error && result.error instanceof ZodError) {
    result.error.issues.forEach((issue) => {
      const field = issue.path && issue.path.length > 0 ? issue.path.join(".") : "_error";
      formattedErrors[field] = issue.message || "Validation error";
    });
  } else {
    // Fallback if error structure is unexpected
    formattedErrors._error = "Validation failed";
  }

  return {
    success: false,
    data: null,
    errors: formattedErrors,
  };
};