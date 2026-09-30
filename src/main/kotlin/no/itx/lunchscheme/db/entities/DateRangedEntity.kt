package no.itx.lunchscheme.db.entities

import jakarta.persistence.Column
import jakarta.persistence.MappedSuperclass
import java.time.LocalDate

@MappedSuperclass
class DateRangedEntity (
    @Column(name = "start_date", nullable = false)
    var startDate: LocalDate,
    @Column(name = "end_date")
    var endDate: LocalDate?
) {
    fun isWithin() = isWithin(LocalDate.now())
    fun isWithin(date: LocalDate) =
        (startDate.isBefore(date) || startDate.isEqual(date)) &&
        (endDate == null || endDate!!.isAfter(date) || endDate!!.isEqual(date))
}