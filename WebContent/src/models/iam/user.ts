import {z} from "zod"
import {roleSchema} from "@/models/iam/role"

export const userSchema = z.object({
  id: z.number().nullish(),
  email: z.email(),
  name: z.string(),
  createdAt: z.iso.datetime().nullish(),
  updatedAt: z.iso.datetime().nullish(),
  roles: z.array(roleSchema)
})

export type User = z.infer<typeof userSchema>