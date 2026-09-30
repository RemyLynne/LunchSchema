package no.itx.lunchscheme.menu.web.dto

import no.itx.lunchscheme.i18n.dto.TextDto
import no.itx.lunchscheme.web.dto.Dto

data class LunchOptionRequestDto(
    val id: Int?,
    val name: TextDto,
    val billing: BillingDto,
    val availableDays: Set<Int>
) : Dto()