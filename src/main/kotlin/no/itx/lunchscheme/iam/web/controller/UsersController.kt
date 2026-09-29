package no.itx.lunchscheme.iam.web.controller

import jakarta.servlet.http.HttpServletRequest
import jakarta.validation.Valid
import no.itx.lunchscheme.Parse
import no.itx.lunchscheme.i18n.TranslationService
import no.itx.lunchscheme.iam.PermissionConstant
import no.itx.lunchscheme.iam.db.entities.AuthLog
import no.itx.lunchscheme.iam.db.entities.User
import no.itx.lunchscheme.iam.db.entities.UserCredential
import no.itx.lunchscheme.iam.db.repositories.RoleRepository
import no.itx.lunchscheme.iam.db.repositories.UserCredentialRepository
import no.itx.lunchscheme.iam.db.repositories.UserRepository
import no.itx.lunchscheme.iam.web.dto.PageDto
import no.itx.lunchscheme.iam.web.dto.UserDto
import no.itx.lunchscheme.iam.web.dto.UserRequestDto
import no.itx.lunchscheme.iam.web.service.AuthLogService
import no.itx.lunchscheme.web.WebConstants.API_BASE
import no.itx.lunchscheme.web.exception.HttpEndpointException
import no.itx.lunchscheme.web.toDto
import no.itx.lunchscheme.web.utils.RequestUtils
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.Instant

@RestController
@RequestMapping("$API_BASE/users")
class UsersController(
    private val userRepository: UserRepository,
    private val userCredentialRepository: UserCredentialRepository,
    private val translationService: TranslationService,
    private val roleRepository: RoleRepository,
    private val passwordEncoder: PasswordEncoder,
    private val authLogService: AuthLogService
) {
    private val log = LoggerFactory.getLogger(javaClass)

    @GetMapping
    @PreAuthorize("hasAuthority('${PermissionConstant.ADMIN_USERS_VIEW}')")
    fun getUsers(
        @RequestParam(value = "page", defaultValue = "0") page: Int,
        @RequestParam(value = "size", defaultValue = "25") size: Int,
    ): ResponseEntity<PageDto<UserDto>> {
        if (page < 0) throw HttpEndpointException(translationService.get("error.validation.number.nonNegative", "page"), HttpStatus.BAD_REQUEST)
        if (size <= 0) throw HttpEndpointException(translationService.get("error.validation.number.positive", "size"), HttpStatus.BAD_REQUEST)

        val users = userRepository.findAll(PageRequest.of(page, size))

        return ResponseEntity.ok(users.toDto())
    }

    @PostMapping
    @PreAuthorize("hasAuthority('${PermissionConstant.ADMIN_USERS_EDIT}')")
    @Transactional
    fun postUser(
        @RequestBody @Valid postRequest: UserRequestDto,
        authentication: Authentication,
        request: HttpServletRequest,
    ): ResponseEntity<UserDto> {
        val ip = RequestUtils.ipFrom(request)
        val userAgent = RequestUtils.userAgentFrom(request)
        val executor = userRepository.findByEmail(authentication.name).orElseThrow() //should not be able to throw

        val new = postRequest.id == null
        log.debug("Account {} attempt from userId={} ip={} user_agent={}", if (new) "creation" else "update", executor.id, ip, userAgent)

        var user = if (new) {
            User(postRequest.email, "")
        } else {
            userRepository.findById(postRequest.id).orElseThrow {
                HttpEndpointException(translationService.get("error.account.idNotFound", postRequest.id), HttpStatus.BAD_REQUEST)
            }
        }

        if (new && Parse.nullOrEmpty(postRequest.password))
            throw HttpEndpointException(translationService.get("error.account.createWithoutPassword"), HttpStatus.BAD_REQUEST)

        user.name = postRequest.name
        user.roles = roleRepository.findAllById(postRequest.roles).toMutableSet()
        user = userRepository.save(user)

        if (new)
            authLogService.log(AuthLog.AuthLogAction.CREATE, AuthLog.AuthLogResult.SUCCESS, "Created by userId=${executor.id}", ip, userAgent, user)
        else
            authLogService.log(AuthLog.AuthLogAction.UPDATE, AuthLog.AuthLogResult.SUCCESS, "Updated by userId=${executor.id}", ip, userAgent, user)

        if (Parse.nullOrEmpty(postRequest.password))
            return ResponseEntity.status(HttpStatus.OK).body(user.toDto())

        val credentials = userCredentialRepository.findByUser(user)
            .orElse(UserCredential(user, passwordEncoder.encode(postRequest.password)!!))
        credentials!!.lastChangedAt = Instant.now()
        userCredentialRepository.save(credentials)

        return ResponseEntity.status(if (new) HttpStatus.CREATED else HttpStatus.OK).body(user.toDto())
    }
}
