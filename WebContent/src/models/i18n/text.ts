import {z} from "zod"
import i18n from "@/i18n"

export const textSchema = z.object({
  id: z.number().nullish(),
  systemKey: z.string().nullish(),
  content: z.string(),
  translations: z.object().catchall(z.string())
})

export type Text = z.infer<typeof textSchema>

export function translateText(text: Text): string {
  const lang = i18n.resolvedLanguage
  if (lang == null)
    return text.content
  const translation: string = text.translations[lang]
  if (translation == null)
    return text.content
  return translation
}