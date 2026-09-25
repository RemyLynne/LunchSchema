package no.itx.lunchscheme.web.dto

import no.itx.lunchscheme.web.exception.HttpException
import java.time.Instant

class ErrorResponse {
    val timestamp: Instant
    val status: Int
    val method: String
    val path: String
    val message: String
    val data: Any?

    constructor(exception: HttpException) {
        timestamp = exception.timestamp
        status = exception.httpStatus.value()
        method = exception.httpMethod.name()
        path = exception.path
        message = exception.clientMessage
        data = exception.data
    }
}