package no.itx.lunchscheme.i18n

import org.slf4j.LoggerFactory
import org.springframework.context.MessageSource
import org.springframework.context.NoSuchMessageException
import org.springframework.context.i18n.LocaleContextHolder
import org.springframework.core.env.Environment
import org.springframework.stereotype.Service
import java.util.Locale
import kotlin.collections.contains

@Service
class TranslationService (
    private val messageSource: MessageSource,
    private val environment: Environment
) {
    private val log = LoggerFactory.getLogger(javaClass)

    /**
     * Convenience overload of [get] that uses the current locale and the key
     * itself as the fallback value.
     */
    fun get(key: String, vararg args: Any): String {
        return get(key, key, *args)
    }

    /**
     * Convenience overload of [get] that uses the key itself as the fallback value.
     */
    fun get(key: String, locale: Locale, vararg args: Any): String {
        return get(key, key, locale, *args)
    }

    /**
     * Convenience overload of [get] that uses the current locale from
     * [LocaleContextHolder].
     */
    fun get(key: String, fallback: String, vararg args: Any): String {
        val locale = LocaleContextHolder.getLocale()
        return get(key, fallback, locale, *args)
    }

    /**
     * Resolves a localized message for the given key and locale.
     *
     * Attempts to retrieve the message from the underlying [messageSource]
     * and format it with the supplied arguments. If no translation exists for the
     * specified key and locale, the provided fallback value is used instead.
     *
     * @param[key] The message key to resolve
     * @param[fallback] The fallback message to return when no translation is found
     * @param[locale] The locale to resolve the message for
     * @param[args] Optional arguments used for message formatting
     * @return the resolved and formatted message, or the formatted fallback message
     *         if the translation is missing
     */
    fun get(key: String, fallback: String, locale: Locale, vararg args: Any): String {
        return try {
            messageSource.getMessage(key, args, locale)
        } catch (e: NoSuchMessageException) {
            if (environment.activeProfiles.contains("debug"))
                log.warn("Could not get translation '$key' for locale '$locale'", e)
            messageSource.getMessage(key, args, fallback, locale) as String //use getter to apply args correctly
        }
    }
}