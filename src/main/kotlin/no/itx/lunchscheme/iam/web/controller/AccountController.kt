package no.itx.lunchscheme.iam.web.controller

import no.itx.lunchscheme.iam.db.repositories.UserRepository
import no.itx.lunchscheme.iam.web.dto.UserDto
import no.itx.lunchscheme.web.WebConstants.API_BASE
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("$API_BASE/account")
class AccountController(
    private val userRepository: UserRepository
) {
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    fun getAccount(
        authentication: Authentication
    ): ResponseEntity<UserDto> {
        val user = userRepository.findByEmail(authentication.name).orElseThrow() //should not be able to throw

        return ResponseEntity.ok(UserDto.from(user))
    }
}