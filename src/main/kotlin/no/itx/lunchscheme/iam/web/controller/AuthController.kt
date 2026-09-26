package no.itx.lunchscheme.iam.web.controller

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import jakarta.validation.Valid
import no.itx.lunchscheme.i18n.TranslationService
import no.itx.lunchscheme.web.WebConstants.API_BASE
import no.itx.lunchscheme.web.utils.RequestUtils
import no.itx.lunchscheme.iam.db.entities.AuthLog
import no.itx.lunchscheme.iam.db.entities.User
import no.itx.lunchscheme.iam.db.entities.UserCredential
import no.itx.lunchscheme.iam.db.repositories.UserCredentialRepository
import no.itx.lunchscheme.iam.db.repositories.UserRepository
import no.itx.lunchscheme.iam.web.service.AuthLogService
import no.itx.lunchscheme.iam.web.dto.LoginRequestDto
import no.itx.lunchscheme.iam.web.dto.RegisterRequestDto
import no.itx.lunchscheme.iam.web.dto.UserDto
import no.itx.lunchscheme.web.exception.HttpEndpointException
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.AuthenticationException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.authentication.logout.CookieClearingLogoutHandler
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler
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
    private val securityContextRepository: SecurityContextRepository,
    private val translationService: TranslationService,
    private val userCredentialRepository: UserCredentialRepository,
    private val passwordEncoder: PasswordEncoder
) {
    private val log = LoggerFactory.getLogger(javaClass)

    private val logoutHandler = SecurityContextLogoutHandler().apply {
        setSecurityContextRepository(securityContextRepository)
    }
    private val cookieClearer = CookieClearingLogoutHandler("JSESSIONID")

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

        val user = authenticate(loginRequest.email, loginRequest.password, request, response, ip, userAgent)

        return ResponseEntity.status(HttpStatus.OK).body(UserDto.from(user))
    }

    @PostMapping("/logout")
    fun logout(
        authentication: Authentication?,
        request: HttpServletRequest,
        response: HttpServletResponse
    ): ResponseEntity<Void> {
        val ip = RequestUtils.ipFrom(request)
        val userAgent = RequestUtils.userAgentFrom(request)

        log.debug("Logout attempt ip={} user_agent='{}'", ip, userAgent)

        if (authentication != null) {
            try {
                val user = userRepository.findByEmail(authentication.principal as String).orElseThrow() //should not be able to throw
                authLogService.log(AuthLog.AuthLogAction.LOGOUT, AuthLog.AuthLogResult.SUCCESS, null, ip, userAgent, user)
            } catch (ex: NoSuchElementException) {
                log.warn("Could not find user with email: {}", authentication.principal)
            }
        }

        logoutHandler.logout(request, response, authentication)
        cookieClearer.logout(request, response, authentication)
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/register")
    @PreAuthorize("isAnonymous()")
    fun register(
        @RequestBody @Valid registerRequest: RegisterRequestDto,
        request: HttpServletRequest,
        response: HttpServletResponse
    ): ResponseEntity<UserDto> {
        val ip = RequestUtils.ipFrom(request)
        val userAgent = RequestUtils.userAgentFrom(request)

        log.debug("Registration attempt email={} ip={} user_agent='{}'", registerRequest.email, ip, userAgent)

        var user = userRepository.findByEmail(registerRequest.email).orElseThrow {
            HttpEndpointException(translationService.get("error.account.emailNotFound", registerRequest.email), HttpStatus.BAD_REQUEST)
        }

        val optCredential = userCredentialRepository.findByUser(user)
        if (optCredential.isPresent) {
            authLogService.log(AuthLog.AuthLogAction.REGISTER, AuthLog.AuthLogResult.FAILURE, "Account already registered", ip, userAgent, user)
        }

        userCredentialRepository.save(UserCredential(user, passwordEncoder.encode(registerRequest.password)!!))
        authLogService.log(AuthLog.AuthLogAction.REGISTER, AuthLog.AuthLogResult.SUCCESS, null, ip, userAgent, user)

        user = authenticate(registerRequest.email, registerRequest.password, request, response, ip, userAgent)

        return ResponseEntity.status(HttpStatus.OK).body(UserDto.from(user))
    }

    private fun authenticate(
        email: String,
        password: String,
        request: HttpServletRequest,
        response: HttpServletResponse,
        ip: String?,
        userAgent: String?
    ): User {
        var auth: Authentication = UsernamePasswordAuthenticationToken.unauthenticated(email, password)

        try {
            auth = authenticationManager.authenticate(auth)
        } catch (ex: AuthenticationException) {
            authLogService.log(AuthLog.AuthLogAction.LOGIN, AuthLog.AuthLogResult.FAILURE, ex.message, ip, userAgent, null)
            throw HttpEndpointException(ex, translationService.get("error.unauthorized"), HttpStatus.UNAUTHORIZED)
        }

        val context = SecurityContextHolder.createEmptyContext()
        context.authentication = auth
        SecurityContextHolder.setContext(context)
        securityContextRepository.saveContext(context, request, response)

        val user = userRepository.findByEmail(email).orElseThrow() //should not be able to throw

        authLogService.log(AuthLog.AuthLogAction.LOGIN, AuthLog.AuthLogResult.SUCCESS, null, ip, userAgent, user)

        return user
    }
}