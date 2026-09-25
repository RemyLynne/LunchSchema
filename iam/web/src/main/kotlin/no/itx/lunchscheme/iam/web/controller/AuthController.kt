package no.itx.lunchscheme.iam.web.controller

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import jakarta.validation.Valid
import no.itx.lunchscheme.common.web.WebConstants.API_BASE
import no.itx.lunchscheme.common.web.utils.RequestUtils
import no.itx.lunchscheme.iam.db.entities.AuthLog
import no.itx.lunchscheme.iam.db.repositories.UserRepository
import no.itx.lunchscheme.iam.web.service.AuthLogService
import no.itx.lunchscheme.iam.web.dto.LoginRequestDto
import no.itx.lunchscheme.iam.web.dto.UserDto
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.AuthenticationException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.context.SecurityContextRepository
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("$API_BASE/auth")
class AuthController(
    private val authenticationManager: AuthenticationManager,
    private val authLogService: AuthLogService,
    private val userRepository: UserRepository,
    private val securityContextRepository: SecurityContextRepository
) {
    private val log = LoggerFactory.getLogger(javaClass)

    @PostMapping("/login")
    @PreAuthorize("isAnonymous()")
    fun login(
        @RequestBody @Valid loginRequest: LoginRequestDto,
        request: HttpServletRequest,
        response: HttpServletResponse
    ): ResponseEntity<UserDto> {
        val ip = RequestUtils.ipFrom(request)
        val userAgent = RequestUtils.userAgentFrom(request)

        log.debug("Login attempt email={} ip={} user_agent='{}'", loginRequest.email, ip, userAgent)

        var auth: Authentication = UsernamePasswordAuthenticationToken.unauthenticated(loginRequest.email, loginRequest.password)

        try {
            auth = authenticationManager.authenticate(auth)
        } catch (ex: AuthenticationException) {
            authLogService.log(
                AuthLog.AuthLogAction.LOGIN,
                AuthLog.AuthLogResult.FAILURE,
                ex.message,
                ip,
                userAgent,
                null,
            )
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
        }

        val user = userRepository.findByEmail(loginRequest.email).orElseThrow() //should not be able to throw

        val context = SecurityContextHolder.createEmptyContext()
        context.authentication = auth
        SecurityContextHolder.setContext(context)
        securityContextRepository.saveContext(context, request, response)

        authLogService.log(
            AuthLog.AuthLogAction.LOGIN,
            AuthLog.AuthLogResult.SUCCESS,
            null,
            ip,
            userAgent,
            user
        )

        return ResponseEntity.status(HttpStatus.OK).body(UserDto.from(user))
    }
}