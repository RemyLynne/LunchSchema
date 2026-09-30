package no.itx.lunchscheme.menu.db.entities

import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.OneToMany
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import no.itx.lunchscheme.db.entities.DateRangedEntity
import no.itx.lunchscheme.i18n.db.entities.Text
import no.itx.lunchscheme.menu.web.dto.LunchOptionResponseDto
import no.itx.lunchscheme.web.WithResponseDto
import java.time.DayOfWeek
import java.time.LocalDate

@Entity
@Table(name = "lunch_options")
class LunchOption (
    @OneToOne(cascade = [CascadeType.ALL], optional = false, orphanRemoval = true)
    @JoinColumn(name = "title_text_id", nullable = false)
    var title: Text,
    @Column(name = "remove_date")
    var endDate: LocalDate?
) : WithResponseDto<LunchOptionResponseDto> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    var id: Int? = null
        protected set
    @OneToMany(mappedBy = "option", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.EAGER)
    var billings: MutableSet<LunchBilling> = mutableSetOf()
        protected set
    @OneToMany(mappedBy = "option", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.EAGER)
    var availabilities: MutableSet<LunchAvailability> = mutableSetOf()
        protected set

    override fun toDto() = toDto(LocalDate.now())

    fun toDto(date: LocalDate): LunchOptionResponseDto {
        val currentBilling = billings.filter { it.isWithin(date) }.maxByOrNull { it.startDate }
        val newBilling = billings.filter { it.isWithin(date.plusMonths(1)) }.maxByOrNull { it.startDate }

        val currentAvailabilities = availabilities.filter { it.isWithin(date) }
        val newAvailabilities = availabilities.filter { it.isWithin(date.plusMonths(1)) }

        val removalDate = if (endDate == null) null
        else {
            if (date.plusMonths(1).isAfter(endDate)) endDate
            else null
        }

        return LunchOptionResponseDto(
            id,
            title.toDto(),
            currentBilling?.toDto(),
            newBilling?.toDto(),
            currentAvailabilities.map { it.day.ordinal }.toSet(),
            newAvailabilities.map { it.day.ordinal }.toSet(),
            removalDate
        )
    }

    fun setNewBilling(price: Int, billingPeriod: LunchBilling.BillingPeriod) {
        val now = LocalDate.now()

        //end or reopen current billing
        var shouldContinueCurrent = false
        billings
            .filter(nowAndFutureFilter(now))
            .filter { it.startDate.isBefore(now) || it.startDate.isEqual(now) }
            .forEach {
                it.endDate = if (it.price != price || it.billingPeriod != billingPeriod)
                    now.withDayOfMonth(now.lengthOfMonth())
                else {
                    shouldContinueCurrent = shouldContinueCurrent || it.endDate != null
                    null
                }
            }

        //remove future billings, as to continue using the current
        if (shouldContinueCurrent) {
            billings.removeIf { it.startDate.isAfter(now) }
            return
        }

        //update any future billings
        var useUpdated = false
        billings
            .filter { it.startDate.isAfter(now) }
            .forEach {
                it.endDate = null
                it.price = price
                it.billingPeriod = billingPeriod
                useUpdated = true
            }

        if (useUpdated) return

        //Create new billing
        billings.add(LunchBilling(
            this,
            price,
            billingPeriod,
            now.plusMonths(1).withDayOfMonth(1),
            null
        ))
    }

    fun setNewAvailabilities(newAvailabilities: Set<DayOfWeek>) {
        val now = LocalDate.now()

        //end or reopen current availabilities
        availabilities
            .filter(nowAndFutureFilter(now))
            .filter { (it.startDate.isBefore(now) || it.startDate.isEqual(now)) }
            .forEach {
                it.endDate = if (!newAvailabilities.contains(it.day))
                    now.withDayOfMonth(now.lengthOfMonth())
                else null
            }

        //remove future availabilities that no longer exist
        availabilities.removeIf { it.startDate.isAfter(now) && !newAvailabilities.contains(it.day) }

        //add future availabilities that are added
        newAvailabilities.filter { availability -> !availabilities.filter(nowAndFutureFilter(now)).any { availability == it.day } }
            .forEach {
                availabilities.add(LunchAvailability(
                    this,
                    it,
                    now.plusMonths(1).withDayOfMonth(1),
                    null
                ))
            }
    }

    private fun <T : DateRangedEntity> nowAndFutureFilter(date: LocalDate): (T) -> Boolean =
        { it.endDate == null || it.endDate!!.isAfter(date) || it.endDate!!.isEqual(date) }
}