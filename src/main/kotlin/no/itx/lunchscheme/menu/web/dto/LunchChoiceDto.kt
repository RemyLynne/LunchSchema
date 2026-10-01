package no.itx.lunchscheme.menu.web.dto

import no.itx.lunchscheme.web.dto.Dto

data class LunchChoiceDto (
    val optionId: Int,
    val day: Int
) : Dto()