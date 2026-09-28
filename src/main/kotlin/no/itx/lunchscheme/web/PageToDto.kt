package no.itx.lunchscheme.web

import no.itx.lunchscheme.iam.web.dto.PageDto
import no.itx.lunchscheme.web.dto.Dto
import org.springframework.data.domain.Page

fun <T : Dto, V : WithResponseDto<T>> Page<V>.toDto() = PageDto(totalPages, totalElements, content.map(WithResponseDto<T>::toDto))