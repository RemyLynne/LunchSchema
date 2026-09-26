import type {TFunction} from "i18next"

export type AppText =
  | { kind: "i18n"; key: string }
  | { kind: "translated"; text: string }

export function getAppText(apptext: AppText, translator: TFunction ): string {
  if (apptext.kind === "translated")
    return apptext.text
  return translator(apptext.key)
}