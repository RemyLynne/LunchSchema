package no.itx.lunchscheme.iam.web.controller

import no.itx.lunchscheme.i18n.TranslationService
import no.itx.lunchscheme.iam.PermissionConstant
import no.itx.lunchscheme.iam.db.repositories.UserRepository
import no.itx.lunchscheme.iam.web.dto.PageDto
import no.itx.lunchscheme.iam.web.dto.UserDto
import no.itx.lunchscheme.web.WebConstants.API_BASE
import no.itx.lunchscheme.web.exception.HttpEndpointException
import no.itx.lunchscheme.web.toDto
import org.springframework.data.domain.PageRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("$API_BASE/users")
class UsersController(
    private val userRepository: UserRepository,
    private val translationService: TranslationService
) {
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
}
