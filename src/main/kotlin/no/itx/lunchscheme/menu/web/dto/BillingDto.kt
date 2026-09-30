package no.itx.lunchscheme.menu.web.dto

import no.itx.lunchscheme.web.dto.Dto
import no.itx.lunchscheme.web.dto.EnumDto

data class BillingDto (
    val price: Int,
    val billingPeriod: BillingPeriodDto
) : Dto() {
    enum class BillingPeriodDto : EnumDto {
        day,
        month
    }
}