import {z} from "zod"
import {roleSchema} from "@/models/iam/role"

export const userSchema = z.object({
  id: z.number(),
  email: z.email(),
  name: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  roles: z.array(roleSchema)
})

export type User = z.infer<typeof userSchema>