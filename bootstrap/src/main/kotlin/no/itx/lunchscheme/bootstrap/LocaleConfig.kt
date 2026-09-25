package no.itx.lunchscheme.bootstrap

import no.itx.lunchscheme.common.i18n.I18nConstants
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.LocaleResolver
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver

@Configuration
class LocaleConfig {
    @Bean
    fun localeResolver(): LocaleResolver {
        val resolver = AcceptHeaderLocaleResolver()
        resolver.setDefaultLocale(I18nConstants.DEFAULT_LOCALE)
        resolver.supportedLocales = I18nConstants.SUPPORTED_LOCALES
        return resolver
    }
}