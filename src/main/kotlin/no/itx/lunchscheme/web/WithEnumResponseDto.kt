package no.itx.lunchscheme.web

import no.itx.lunchscheme.web.dto.EnumDto

interface WithEnumResponseDto<T : EnumDto> {
    fun toDto(): T
}