import {z} from "zod"

export const textSchema = z.object({
  id: z.number().nullish(),
  systemKey: z.string().nullish(),
  content: z.string(),
  translations: z.object().catchall(z.string())
})

export type Text = z.infer<typeof textSchema>