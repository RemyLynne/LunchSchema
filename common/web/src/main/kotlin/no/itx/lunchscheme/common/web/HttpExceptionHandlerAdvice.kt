package no.itx.lunchscheme.common.web

import jakarta.servlet.http.HttpServletRequest
import no.itx.lunchscheme.common.i18n.TranslationService
import no.itx.lunchscheme.common.web.dto.ArgumentField
import no.itx.lunchscheme.common.web.dto.ErrorResponse
import no.itx.lunchscheme.common.web.exception.HttpEndpointException
import no.itx.lunchscheme.common.web.exception.HttpException
import org.slf4j.LoggerFactory
import org.springframework.core.env.Environment
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.HttpMediaTypeNotSupportedException
import org.springframework.web.HttpRequestMethodNotSupportedException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.MissingServletRequestParameterException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.method.annotation.HandlerMethodValidationException
import org.springframework.web.servlet.resource.NoResourceFoundException

@ControllerAdvice
class HttpExceptionHandlerAdvice (
    private val environment: Environment,
    private val translationService: TranslationService
) {
    private val log = LoggerFactory.getLogger(javaClass)

    @ExceptionHandler(HttpException::class)
    fun handleHttpException(e: HttpException): ResponseEntity<ErrorResponse> {
        if (e.httpStatus.is5xxServerError)
            log.error(e.toLogEntry(), e)
        else if (environment.activeProfiles.contains("debug"))
            log.warn(e.toLogEntry(), e)

        return ResponseEntity(ErrorResponse(e), e.httpStatus)
    }

    @ExceptionHandler(HttpEndpointException::class)
    fun handleEndpointException(e: HttpEndpointException, request: HttpServletRequest) =
        handleHttpException(HttpException(
            e.message!!,
            e,
            e.clientMessage,
            HttpMethod.valueOf(request.method),
            e.httpStatus,
            request.requestURI,
        ))

    @ExceptionHandler(NoResourceFoundException::class)
    fun handleNoResourceFoundException(e: NoResourceFoundException) =
        handleHttpException(HttpException(
            e.message ?: "No resource found",
            e,
            translationService.get("error.http.notFound"),
            e.httpMethod,
            HttpStatus.NOT_FOUND,
            e.resourcePath
        ))

    @ExceptionHandler(HttpRequestMethodNotSupportedException::class)
    fun handleHttpRequestMethodNotSupportedException(e: HttpRequestMethodNotSupportedException, request: HttpServletRequest) =
        handleHttpException(HttpException(
            e.message ?: "Method Not Supported",
            e,
            translationService.get("error.http.methodNotAllowed"),
            HttpMethod.valueOf(e.method),
            HttpStatus.METHOD_NOT_ALLOWED,
            request.requestURI
        ))

    @ExceptionHandler(HttpMessageNotReadableException::class)
    fun handleHttpMessageNotReadableException(e: HttpMessageNotReadableException, request: HttpServletRequest) =
        handleHttpException(HttpException(
            e.message ?: "Request body not readable",
            e,
            translationService.get("error.validation.body.missingOrUnreadable"),
            HttpMethod.valueOf(request.method),
            HttpStatus.BAD_REQUEST,
            request.requestURI
        ))

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleMethodArgumentNotValidException(e: MethodArgumentNotValidException, request: HttpServletRequest): ResponseEntity<ErrorResponse> {
        val errors = e.bindingResult.fieldErrors.map {
            ArgumentField(
                it.field,
                it.code,
                it.defaultMessage ?: translationService.get("error.invalid")
            )
        }

        val httpException = HttpException(
            e.message,
            e,
            translationService.get("error.validation.body.invalid"),
            HttpMethod.valueOf(request.method),
            HttpStatus.UNPROCESSABLE_CONTENT,
            request.requestURI
        )
        httpException.data = errors

        return handleHttpException(httpException)
    }

    @ExceptionHandler(HandlerMethodValidationException::class)
    fun handleHandlerMethodValidationException(e: HandlerMethodValidationException, request: HttpServletRequest) =
        handleHttpException(HttpException(
            e.message,
            e,
            translationService.get("error.validation.parameters.invalid"),
            HttpMethod.valueOf(request.method),
            HttpStatus.BAD_REQUEST,
            request.requestURI
        ))

    @ExceptionHandler(MissingServletRequestParameterException::class)
    fun handleMissingServletRequestParameterException(e: MissingServletRequestParameterException, request: HttpServletRequest) =
        handleHttpException(HttpException(
            e.message,
            e,
            translationService.get("error.validation.parameters.missing"),
            HttpMethod.valueOf(request.method),
            HttpStatus.BAD_REQUEST,
            request.requestURI
        ))

    @ExceptionHandler(HttpMediaTypeNotSupportedException::class)
    fun handleHttpMediaTypeNotSupportedException(e: HttpMediaTypeNotSupportedException, request: HttpServletRequest) =
        handleHttpException(HttpException(
            e.message ?: "Unsupported media type '${e.contentType}'",
            e,
            translationService.get("error.http.unsupportedContentType", e.contentType ?: "unknown"),
            HttpMethod.valueOf(request.method),
            HttpStatus.BAD_REQUEST,
            request.requestURI
        ))

    @ExceptionHandler(Throwable::class)
    fun handleThrowable(throwable: Throwable, request: HttpServletRequest) =
        handleHttpException(HttpException(
            throwable.message ?: "Internal Server Error",
            throwable,
            translationService.get("error.server.internal"),
            HttpMethod.valueOf(request.method),
            HttpStatus.INTERNAL_SERVER_ERROR,
            request.requestURI
        ))
}