package no.itx.lunchscheme.web.exception

import jakarta.servlet.ServletException
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import java.time.Instant

/**
 * Internal exception class
 * @see HttpEndpointException
 */
class HttpException : ServletException {
    val timestamp: Instant
    val clientMessage: String
    val httpMethod: HttpMethod
    val httpStatus: HttpStatus
    val path: String
    var data: Any? = null

    constructor(clientMessage: String, httpMethod: HttpMethod, httpStatus: HttpStatus, path: String) : super(clientMessage) {
        this.timestamp = Instant.now()
        this.clientMessage = clientMessage
        this.httpMethod = httpMethod
        this.httpStatus = httpStatus
        this.path = path
    }
    constructor(message: String, clientMessage: String, httpMethod: HttpMethod, httpStatus: HttpStatus, path: String) : super(message) {
        this.timestamp = Instant.now()
        this.clientMessage = clientMessage
        this.httpMethod = httpMethod
        this.httpStatus = httpStatus
        this.path = path
    }
    constructor(cause: Throwable, clientMessage: String, httpMethod: HttpMethod, httpStatus: HttpStatus, path: String) : super(cause) {
        this.timestamp = Instant.now()
        this.clientMessage = clientMessage
        this.httpMethod = httpMethod
        this.httpStatus = httpStatus
        this.path = path
    }
    constructor(message: String, cause: Throwable, clientMessage: String, httpMethod: HttpMethod, httpStatus: HttpStatus, path: String) : super(message, cause) {
        this.timestamp = Instant.now()
        this.clientMessage = clientMessage
        this.httpMethod = httpMethod
        this.httpStatus = httpStatus
        this.path = path
    }

    fun toLogEntry(): String {
        return String.format("[%s:%s]: %s", httpMethod, path, httpStatus)
    }
}