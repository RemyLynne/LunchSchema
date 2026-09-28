package no.itx.lunchscheme.iam.web.dto

import no.itx.lunchscheme.i18n.dto.TextDto
import no.itx.lunchscheme.web.dto.Dto

class PermissionDto(
    val id: Int?,
    val name: String,
    val title: TextDto
) : Dto()