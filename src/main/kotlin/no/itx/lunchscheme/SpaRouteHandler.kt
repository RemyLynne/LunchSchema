package no.itx.lunchscheme

import no.itx.lunchscheme.web.HttpExceptionHandlerAdvice
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.http.HttpMethod
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.servlet.ModelAndView
import org.springframework.web.servlet.resource.NoResourceFoundException

@ControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE) //make us to handle 404's instead of HttpExceptionHandlerAdvice
class SpaRouteHandler (
    private val httpExceptionHandlerAdvice: HttpExceptionHandlerAdvice
) {
    @ExceptionHandler(NoResourceFoundException::class)
    fun notFoundRoute(ex: NoResourceFoundException): Any {
        val reservedPaths = setOf("api", "actuator", "error")
        val requestPath = ex.resourcePath.trimStart('/')
        val firstSegment = requestPath.substringBefore('/')

        val isSpaRoute =
            ex.httpMethod == HttpMethod.GET &&
                    firstSegment !in reservedPaths &&
                    !requestPath.hasStaticAssetExtension()

        return if (isSpaRoute) {
            ModelAndView("forward:/index.html")
        } else {
            httpExceptionHandlerAdvice.handleNoResourceFoundException(ex)
        }
    }

    private fun String.hasStaticAssetExtension(): Boolean {
        val staticExtensions = setOf(
            "css", "js", "jpg", "jpeg", "img", "map", "png", "svg",
            "ogg", "mp3", "m4a", "json"
        )

        return substringAfterLast('.', missingDelimiterValue = "") in staticExtensions
    }
}