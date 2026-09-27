import {z} from "zod"
import {textSchema} from "@/models/i18n/text"

export const permissionSchema = z.object({
  id: z.number().nullish(),
  name: z.string(),
  title: textSchema
})

export type Permission = z.infer<typeof permissionSchema>