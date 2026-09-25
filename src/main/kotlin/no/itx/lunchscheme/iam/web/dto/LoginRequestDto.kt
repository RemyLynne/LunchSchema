package no.itx.lunchscheme.iam.web.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

data class LoginRequestDto(
    @NotBlank
    @Email
    var email: String,
    @NotBlank
    var password: String
)
