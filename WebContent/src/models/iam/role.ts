import {z} from "zod"
import {textSchema} from "@/models/i18n/text"
import {permissionSchema} from "@/models/iam/permission"

export const roleSchema = z.object({
  id: z.number().nullish(),
  systemKey: z.string().nullish(),
  title: textSchema,
  sort: z.number(),
  permissions: z.array(permissionSchema)
})

export type Role = z.infer<typeof roleSchema>