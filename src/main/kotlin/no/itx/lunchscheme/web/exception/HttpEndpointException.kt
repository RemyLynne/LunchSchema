package no.itx.lunchscheme.web.exception

import jakarta.servlet.ServletException
import org.springframework.http.HttpStatus
import java.time.Instant

//Exception to be thrown inside endpoints
class HttpEndpointException : ServletException {
    val timestamp: Instant
    val clientMessage: String
    val httpStatus: HttpStatus
    var data: Any? = null

    constructor(clientMessage: String, httpStatus: HttpStatus) : super(clientMessage) {
        this.timestamp = Instant.now()
        this.clientMessage = clientMessage
        this.httpStatus = httpStatus
    }
    constructor(message: String, clientMessage: String, httpStatus: HttpStatus) : super(message) {
        this.timestamp = Instant.now()
        this.clientMessage = clientMessage
        this.httpStatus = httpStatus
    }
    constructor(cause: Throwable, clientMessage: String, httpStatus: HttpStatus) : super(cause) {
        this.timestamp = Instant.now()
        this.clientMessage = clientMessage
        this.httpStatus = httpStatus
    }
    constructor(message: String, cause: Throwable, clientMessage: String, httpStatus: HttpStatus) : super(message, cause) {
        this.timestamp = Instant.now()
        this.clientMessage = clientMessage
        this.httpStatus = httpStatus
    }
}