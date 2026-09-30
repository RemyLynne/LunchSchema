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
import java.time.DayOfWeek
import java.time.LocalDate

@Entity
@Table(name = "lunch_availabilities")
class LunchAvailability (
    @ManyToOne(optional = false)
    @JoinColumn(name = "option_id", nullable = false)
    var option: LunchOption,
    @Enumerated(EnumType.ORDINAL)
    @Column(name = "day", nullable = false)
    var day: DayOfWeek,
    startDate: LocalDate,
    endDate: LocalDate?
) : DateRangedEntity(startDate, endDate) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    var id: Int? = null
        protected set
}