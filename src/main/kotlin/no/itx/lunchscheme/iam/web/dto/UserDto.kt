package no.itx.lunchscheme.iam.web.dto

import no.itx.lunchscheme.web.dto.Dto
import java.time.Instant

data class UserDto(
    val id: Int?,
    val email: String,
    val name: String,
    val createdAt: Instant?,
    val updatedAt: Instant?,
    val roles: Set<RoleDto>,
    val disabled: Boolean?
) : Dto()
