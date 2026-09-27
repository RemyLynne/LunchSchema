package no.itx.lunchscheme.iam.web.dto

import no.itx.lunchscheme.i18n.dto.TextDto
import no.itx.lunchscheme.iam.db.entities.Role

class RoleDto(
    val id: Int?,
    val systemKey: String?,
    val title: TextDto,
    val sort: Int,
    val permissions: Set<PermissionDto>
) {
    companion object {
        fun from(role: Role) = RoleDto(
            role.id,
            role.systemKey,
            TextDto.from(role.title),
            role.sort,
            role.permissions.map { PermissionDto.from(it) }.toSet()
        )
    }
}