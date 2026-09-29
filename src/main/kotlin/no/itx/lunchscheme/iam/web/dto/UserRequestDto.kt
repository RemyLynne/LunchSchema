package no.itx.lunchscheme.iam.web.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import no.itx.lunchscheme.web.dto.Dto

data class UserRequestDto(
    val id: Int?,
    @NotBlank
    @Email
    val email: String,
    @NotBlank
    val name: String,
    val roles: Set<Int>,
    val password: String?
) : Dto()
