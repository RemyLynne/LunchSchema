package no.itx.lunchscheme.web.utils

import jakarta.servlet.http.HttpServletRequest
import kotlin.text.split

object RequestUtils {
    fun ipFrom(req: HttpServletRequest): String {
        val xff = req.getHeader("X-Forwarded-For")
        if (!xff.isNullOrBlank())
            return xff
                .split(",".toRegex())
                .dropLastWhile { it.isEmpty() }
                .toTypedArray()[0]
                .trim { it <= ' ' }
        return req.remoteAddr
    }
    fun userAgentFrom(req: HttpServletRequest): String? {
        val ua = req.getHeader("User-Agent")
        if (!ua.isNullOrBlank())
            return ua
        return null
    }
}