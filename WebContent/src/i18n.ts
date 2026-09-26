import i18next from "i18next"
import I18NextHttpBackend from "i18next-http-backend"
import {initReactI18next} from "react-i18next"

// eslint-disable-next-line import/no-named-as-default-member
void i18next
  .use(I18NextHttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "no"],
    ns: ["common"],
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

export default i18next