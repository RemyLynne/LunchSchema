package no.itx.lunchscheme.menu.db.entities

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import no.itx.lunchscheme.db.entities.DateRangedEntity
import no.itx.lunchscheme.menu.web.dto.BillingDto
import no.itx.lunchscheme.web.WithEnumResponseDto
import no.itx.lunchscheme.web.WithResponseDto
import java.time.LocalDate

@Entity
@Table(name = "lunch_billings")
class LunchBilling (
    @ManyToOne(optional = false)
    @JoinColumn(name = "option_id", nullable = false)
    var option: LunchOption,
    @Column(name = "price", nullable = false)
    var price: Int,
    @Enumerated(EnumType.ORDINAL)
    @Column(name = "billing_period", nullable = false)
    var billingPeriod: BillingPeriod,
    startDate: LocalDate,
    endDate: LocalDate?
) : DateRangedEntity(startDate, endDate), WithResponseDto<BillingDto> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    var id: Int? = null
        protected set

    override fun toDto() = BillingDto(price, billingPeriod.toDto())

    enum class BillingPeriod : WithEnumResponseDto<BillingDto.BillingPeriodDto> {
        DAY,
        MONTH;

        override fun toDto() =
            when (this) {
                DAY -> BillingDto.BillingPeriodDto.day
                MONTH -> BillingDto.BillingPeriodDto.month
            }
    }
}