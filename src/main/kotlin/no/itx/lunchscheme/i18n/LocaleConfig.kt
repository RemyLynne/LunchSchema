package no.itx.lunchscheme.i18n

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.LocaleResolver

@Configuration
class LocaleConfig {
    @Bean
    fun localeResolver(): LocaleResolver =
        AliasingAcceptHeaderLocaleResolver(I18nConstants.LANGUAGE_MAP).apply {
            setDefaultLocale(I18nConstants.DEFAULT_LOCALE)
            supportedLocales = I18nConstants.SUPPORTED_LOCALES
        }
}