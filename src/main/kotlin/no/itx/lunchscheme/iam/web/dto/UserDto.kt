package no.itx.lunchscheme.iam.web.dto

import no.itx.lunchscheme.iam.db.entities.User
import java.time.Instant

data class UserDto(
    val id: Int,
    val email: String,
    val name: String,
    val createdAt: Instant,
    val updatedAt: Instant,
    val roles: Set<RoleDto>
) {
    companion object {
        // only to be used with saved users
        fun from(user: User) = UserDto(
            user.id!!,
            user.email,
            user.name,
            user.createdAt!!,
            user.updatedAt!!,
            user.roles.map { RoleDto.from(it) }.toSet()
        )
    }
}
