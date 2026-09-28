package no.itx.lunchscheme.web

import no.itx.lunchscheme.web.dto.Dto

interface WithResponseDto<T : Dto> {
    fun toDto(): T
}