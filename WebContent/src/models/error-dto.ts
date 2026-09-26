import {z} from "zod"

export const errorDtoSchema = z.object({
  timestamp: z.iso.datetime(),
  status: z.number().positive(),
  method: z.string(),
  path: z.string(),
  message: z.string(),
  data: z.any().nullable()
})