package no.itx.lunchscheme.iam.web.service

import no.itx.lunchscheme.iam.db.entities.AuthLog
import no.itx.lunchscheme.iam.db.entities.User
import no.itx.lunchscheme.iam.db.repositories.AuthLogRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class AuthLogService(
    private val authLogRepository: AuthLogRepository,
) {
    private val log = LoggerFactory.getLogger(javaClass)

    fun log(
        action: AuthLog.AuthLogAction,
        result: AuthLog.AuthLogResult,
        reason: String?,
        ip: String?,
        userAgent: String?,
        user: User?
    ) {
        var entity = AuthLog(
            action = action,
            result = result,
            reason = reason,
            ip = ip,
            userAgent = userAgent,
            user = user
        )
        entity = authLogRepository.save(entity)

        val logData = mutableListOf<Pair<String, String>>()
        logData += "log_id" to entity.id.toString()
        logData += "action" to action.name
        logData += "result" to result.name
        if (!reason.isNullOrBlank())
            logData += "reason" to "\"$reason\""
        if (user != null)
            logData += "user_id" to user.id.toString()
        if (ip != null)
            logData += "ip" to ip
        if (userAgent != null)
            logData += "user_agent" to "\"$userAgent\""

        log.info(logData.joinToString(" ", transform = { (key,value) -> "$key=$value" }))
    }
}