package no.itx.lunchscheme.iam.web.dto

import no.itx.lunchscheme.i18n.dto.TextDto
import no.itx.lunchscheme.iam.db.entities.Permission

class PermissionDto(
    val id: Int?,
    val name: String,
    val title: TextDto
) {
    companion object {
        fun from(permission: Permission) = PermissionDto(
            permission.id,
            permission.name,
            TextDto.from(permission.title)
        )
    }
}