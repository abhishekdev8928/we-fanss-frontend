import { z } from 'zod';

// Create Related Personality Schema
export const createRelatedPersonalitySchema = z.object({
  celebrity: z
    .string({
      required_error: 'Celebrity is required',
    })
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid celebrity ID format'),
  relatedCelebrity: z
    .string({
      required_error: 'Related celebrity is required',
    })
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid related celebrity ID format'),
  relationshipType: z.enum(
    ['Mentor', 'Co-star', 'Rival', 'Family', 'Politically', 'Other'],
    {
      required_error: 'Relationship type is required',
    }
  ),
  notes: z.string().trim().optional(),
  status: z
    .number()
    .int()
    .refine((val) => val === 0 || val === 1, {
      message: 'Status must be 0 or 1',
    })
    .optional()
    .default(1),
});

// Update Related Personality Schema
export const updateRelatedPersonalitySchema = z.object({
  celebrity: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid celebrity ID format')
    .optional(),
  relatedCelebrity: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid related celebrity ID format')
    .optional(),
  relationshipType: z
    .enum(['Mentor', 'Co-star', 'Rival', 'Family', 'Politically', 'Other'])
    .optional(),
  notes: z.string().trim().optional(),
  status: z
    .number()
    .int()
    .refine((val) => val === 0 || val === 1, {
      message: 'Status must be 0 or 1',
    })
    .optional(),
});

// Update Related Personality Status Schema
export const updateRelatedPersonalityStatusSchema = z.object({
  status: z
    .number({
      required_error: 'Status is required',
    })
    .int()
    .refine((val) => val === 0 || val === 1, {
      message: 'Status must be 0 or 1',
    }),
});
