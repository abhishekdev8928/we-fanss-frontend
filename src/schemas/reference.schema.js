import { z } from 'zod';

// Create Reference Schema
export const createReferenceSchema = z.object({


celebrityId: z
      .string({
        required_error: 'Celebrity ID is required',
      })
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid celebrity ID format'),
  title: z
    .string({
      required_error: 'Title is required',
    })
    .trim()
    .min(1, 'Title cannot be empty'),
  url: z
    .string({
      required_error: 'URL is required',
    })
    .trim()
    .url('Invalid URL format'),
  type: z
    .enum(['News', 'Wiki', 'Interview', 'Gov Link', 'Other'])
    .optional(),
  status: z
    .number()
    .int()
    .refine((val) => val === 0 || val === 1, {
      message: 'Status must be 0 or 1',
    })
    .optional(),
});

// Update Reference Schema
export const updateReferenceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title cannot be empty')
    .optional(),
  url: z
    .string()
    .trim()
    .url('Invalid URL format')
    .optional(),
  type: z
    .enum(['News', 'Wiki', 'Interview', 'Gov Link', 'Other'])
    .optional(),
  status: z
    .number()
    .int()
    .refine((val) => val === 0 || val === 1, {
      message: 'Status must be 0 or 1',
    })
    .optional(),
});