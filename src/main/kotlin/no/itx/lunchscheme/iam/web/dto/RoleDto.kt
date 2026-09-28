package no.itx.lunchscheme.iam.web.dto

import no.itx.lunchscheme.i18n.dto.TextDto
import no.itx.lunchscheme.web.dto.Dto

class RoleDto(
    val id: Int?,
    val systemKey: String?,
    val title: TextDto,
    val sort: Int,
    val permissions: Set<PermissionDto>
) : Dto()