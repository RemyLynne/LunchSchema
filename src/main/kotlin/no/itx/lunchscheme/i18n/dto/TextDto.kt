package no.itx.lunchscheme.i18n.dto

import no.itx.lunchscheme.web.dto.Dto

data class TextDto(
    val id: Long?,
    val systemKey: String?,
    val content: String,
    val translations: Map<String, String>
) : Dto()