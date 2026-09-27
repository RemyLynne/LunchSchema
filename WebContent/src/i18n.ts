import i18next from "i18next"
import I18NextHttpBackend from "i18next-http-backend"
import {initReactI18next} from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

const LANGUAGE_MAP: Record<string, string[]> = {
  "no": ["no", "nb", "nn"]
}

const LANGUAGE_ALIASES = new Map(
  Object.entries(LANGUAGE_MAP).flatMap(([target, aliases]) =>
    aliases.map((alias) => [alias.toLowerCase(), target] as const)
  )
)

const convertDetectedLanguage = (lng: string): string => {
  const full = lng.toLowerCase().replace("_", "-")
  const base = full.split("-")[0]
  return LANGUAGE_ALIASES.get(full) ?? LANGUAGE_ALIASES.get(base) ?? lng
}

// eslint-disable-next-line import/no-named-as-default-member
void i18next
  .use(LanguageDetector)
  .use(I18NextHttpBackend)
  .use(initReactI18next)
  .init({
    supportedLngs: ["en", "no"],
    fallbackLng: "en",
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    detection: {
      order: ["navigator"],
      convertDetectedLanguage
    },
    ns: ["common", "auth"],
    defaultNS: "common",
    backend: {
      loadPath: "/i18n/{{lng}}/{{ns}}.json"
    },
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: true
    },
    debug: import.meta.env.DEV,
    parseMissingKeyHandler: (key) => {
      return key
    }
  })

i18next.on("languageChanged", (lng) => {
  document.documentElement.lang = i18next.resolvedLanguage ?? lng
})

export default i18next