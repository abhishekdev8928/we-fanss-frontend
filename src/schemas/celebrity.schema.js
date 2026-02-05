import { z } from "zod";

const familyMemberSchema = z.object({
  name: z.string().trim().optional(),
  profession: z.string().trim().optional(),
  showOnPublicProfile: z.boolean().optional().default(false),
});

const familyMemberWithRelationSchema = z.object({
  name: z.string().trim().optional(),
  profession: z.string().trim().optional(),
  relation: z.string().trim().optional(),
  showOnPublicProfile: z.boolean().optional().default(false),
});

const socialLinkSchema = z.object({
  platform: z.string().trim().min(1, "Platform is required"),
  url: z.string().url("Invalid URL format"),
  label: z.string().trim().optional(),
});

export const createCelebritySchema = z.object({
  identityProfile: z.object({
    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(200, "Name must be less than 200 characters"),
    slug: z
      .string({
        required_error: "Slug is required",
      })
      .trim()
      .min(2, "Slug must be at least 2 characters"),
    gallery: z.array(z.string().trim()).optional(),
    shortinfo: z
      .string({
        required_error: "Short info is required",
      })
      .trim()
      .min(10, "Short info must be at least 10 characters")
      .max(500, "Short info must be less than 500 characters"),
    biography: z
      .string({
        required_error: "Biography is required",
      })
      .trim()
      .min(1, "Biography is required"),
    status: z
      .enum(["Draft", "In Review", "Published", "Archived"])
      .optional()
      .default("Draft"),
  }),

  personalDetails: z.object({
    dob: z
      .string({
        required_error: "Date of birth is required",
      })
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format"),
    birthplace: z.string().trim().optional(),
    gender: z.enum(["Male", "Female", "Other", "Prefer not to say"], {
      required_error: "Gender is required",
    }),
    nationality: z.string().trim().optional(),
    religion: z.string().trim().optional(),
  }),

lifeStatus: z
  .object({
    isAlive: z.boolean().optional().default(true),
    dateOfDeath: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    placeOfDeath: z.string().trim().optional(),
    causeOfDeath: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isAlive && data.dateOfDeath) {
      ctx.addIssue({
        path: ["dateOfDeath"],
        code: z.ZodIssueCode.custom,
        message: "Alive person cannot have date of death",
      });
    }

    if (!data.isAlive && !data.dateOfDeath) {
      ctx.addIssue({
        path: ["dateOfDeath"],
        code: z.ZodIssueCode.custom,
        message: "Date of death is required if person is not alive",
      });
    }
  })
  .optional(),


  familyRelationships: z
    .object({
      father: familyMemberSchema.optional(),
      mother: familyMemberSchema.optional(),
      spouses: z.array(familyMemberSchema).optional(),
      children: z.array(familyMemberWithRelationSchema).optional(),
      siblings: z.array(familyMemberWithRelationSchema).optional(),
    })
    .optional(),

  professionalIdentity: z.object({
    sections: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid section ID format")).optional(),
    professions: z
      .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid profession ID format"))
      .min(1, "At least one profession is required"),
    primaryProfession: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid primary profession ID format")
      .optional(),
    languages: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid language ID format")).optional(),
    primaryLanguage: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid primary language ID format")
      .optional(),
    careerStartYear: z
      .number()
      .int()
      .min(1900, "Career start year must be after 1900")
      .max(new Date().getFullYear(), "Career start year cannot be in the future")
      .optional(),
    careerEndYear: z
      .number()
      .int()
      .min(1900, "Career end year must be after 1900")
      .max(new Date().getFullYear() + 10, "Career end year is too far in the future")
      .optional(),
    isCareerOngoing: z.boolean().optional().default(true),
  }),

  locationPresence: z
    .object({
      currentCity: z.string().trim().optional(),
      knownForRegion: z.array(z.string().trim()).optional(),
    })
    .optional(),

  publicAttributes: z
    .object({
      height: z.string().trim().optional(),
      signatureStyle: z
        .string()
        .trim()
        .max(200, "Signature style must be less than 200 characters")
        .optional(),
    })
    .optional(),

  socialLinks: z.array(socialLinkSchema).optional(),

  seoMetadata: z
    .object({
      tags: z.array(z.string().trim()).optional(),
      seoMetaTitle: z
        .string()
        .trim()
        .max(60, "SEO meta title must be less than 60 characters")
        .optional(),
      seoMetaDescription: z
        .string()
        .trim()
        .max(160, "SEO meta description must be less than 160 characters")
        .optional(),
      seoKeywords: z.array(z.string().trim()).optional(),
    })
    .optional(),

  adminControls: z
    .object({
      isFeatured: z.boolean().optional(),
      verificationStatus: z
        .enum(["Not Claimed", "Claim Requested", "Verified"])
        .optional(),
      internalNotes: z.string().trim().optional(),
    })
    .optional(),
});