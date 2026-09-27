import {z} from "zod"

export const textSchema = z.object({
  id: z.number().nullish(),
  systemKey: z.string().nullish(),
  content: z.string(),
  translation: z.map(z.string(), z.string())
})

export type Text = z.infer<typeof textSchema>