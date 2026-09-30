package no.itx.lunchscheme.menu.web.dto

import no.itx.lunchscheme.i18n.dto.TextDto
import no.itx.lunchscheme.web.dto.Dto
import java.time.LocalDate

data class LunchOptionResponseDto(
    val id: Int?,
    val name: TextDto,
    val currentBilling: BillingDto?,
    val newBilling: BillingDto?,
    val currentAvailableDays: Set<Int>,
    val newAvailableDays: Set<Int>,
    val removalDate: LocalDate?,
) : Dto()