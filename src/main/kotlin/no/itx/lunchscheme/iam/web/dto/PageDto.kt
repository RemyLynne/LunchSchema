package no.itx.lunchscheme.iam.web.dto

import no.itx.lunchscheme.web.dto.Dto

data class PageDto<T : Dto> (
    val totalPages: Int,
    val totalElements: Long,
    val content: List<T>,
)