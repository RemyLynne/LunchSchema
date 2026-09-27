package no.itx.lunchscheme.i18n

import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpHeaders
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver
import java.util.Locale

class AliasingAcceptHeaderLocaleResolver(
    languageMap: Map<String, List<String>>
) : AcceptHeaderLocaleResolver() {
    private val aliases: Map<String, String> =
        languageMap.flatMap { (target, list) -> list.map { it.lowercase() to target } }.toMap()

    override fun resolveLocale(request: HttpServletRequest): Locale {
        val fallback = defaultLocale ?: request.locale

        // Without a header, request.locales returns the server default, so bail early
        if (request.getHeader(HttpHeaders.ACCEPT_LANGUAGE).isNullOrBlank()) return fallback

        // The servlet container already sorts these by q-value
        for (requested in request.locales.asSequence().map(::normalize)) {
            supportedLocales.firstOrNull { it == requested }?.let { return it }
            supportedLocales.firstOrNull { it.language == requested.language }?.let { return it }
        }
        return fallback
    }

    private fun normalize(locale: Locale): Locale {
        val target = aliases[locale.toLanguageTag().lowercase()]
            ?: aliases[locale.language.lowercase()]
            ?: return locale
        return Locale.Builder().setLanguage(target).setRegion(locale.country).build()
    }
}