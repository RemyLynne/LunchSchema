import {z, type ZodObject} from "zod"

export function getPageSchema<T extends ZodObject>(contentSchema: T) {
  return z.object({
    totalPages: z.number(),
    totalElements: z.number(),
    content: contentSchema.array()
  })
}
