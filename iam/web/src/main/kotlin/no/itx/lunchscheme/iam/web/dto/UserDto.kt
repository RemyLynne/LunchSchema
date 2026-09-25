package no.itx.lunchscheme.iam.web.dto

import no.itx.lunchscheme.iam.db.entities.User
import java.time.Instant

data class UserDto(
    val id: Long,
    val email: String,
    val name: String,
    val createdAt: Instant,
    val updatedAt: Instant
) {
    companion object {
        // only to be used with saved users
        fun from(user: User) = UserDto(
            id = user.id!!,
            email = user.email,
            name = user.name,
            createdAt = user.createdAt!!,
            updatedAt = user.updatedAt!!
        )
    }
}
