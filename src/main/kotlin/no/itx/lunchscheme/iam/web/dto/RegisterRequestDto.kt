package no.itx.lunchscheme.iam.web.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

data class RegisterRequestDto(
    @NotBlank
    @Email
    var email: String,
    @NotBlank
    var password: String
)
