import { ZodError } from "zod";

export const validateForm = (schema, data) => {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data, errors: null };
  }

  const errors = {};

  if (result.error instanceof ZodError) {
    for (const issue of result.error.issues) {
      const path = issue.path.length ? issue.path.join(".") : "_error";

      // Keep first error per field (better UX)
      if (!errors[path]) {
        errors[path] = issue.message;
      }
    }
  } else {
    errors._error = "Validation failed";
  }

  return { success: false, data: null, errors };
};

export const getFieldError = (errors, path) => errors?.[path] || null;
export const hasFieldError = (errors, path) => Boolean(errors?.[path]);
