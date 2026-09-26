import {z} from "zod"

export const userSchema = z.object({
  id: z.number(),
  email: z.email(),
  name: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime()
})

export type User = z.infer<typeof userSchema>