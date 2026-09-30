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
import no.itx.lunchscheme.i18n.db.entities.Text
import no.itx.lunchscheme.menu.web.dto.LunchOptionDto
import no.itx.lunchscheme.web.WithResponseDto
import java.time.LocalDate

@Entity
@Table(name = "lunch_options")
class LunchOption (
    @OneToOne(optional = false, orphanRemoval = true)
    @JoinColumn(name = "title_text_id", nullable = false)
    var title: Text,
    @OneToMany(mappedBy = "option", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.EAGER)
    var billings: MutableSet<LunchBilling> = mutableSetOf(),
    @OneToMany(mappedBy = "option", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.EAGER)
    var availabilities: MutableSet<LunchAvailability> = mutableSetOf(),
) : WithResponseDto<LunchOptionDto> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    var id: Int? = null

    override fun toDto() = toDto(LocalDate.now())

    fun toDto(date: LocalDate): LunchOptionDto {
        val currentBilling = billings.filter { it.isWithin(date) }.maxByOrNull { it.startDate }
        val newBilling = billings.filter { it.isWithin(date.plusMonths(1)) }.maxByOrNull { it.startDate }

        val currentAvailabilities = availabilities.filter { it.isWithin(date) }
        val newAvailabilities = availabilities.filter { it.isWithin(date.plusMonths(1)) }

        return LunchOptionDto(
            id,
            title.toDto(),
            currentBilling?.toDto(),
            newBilling?.toDto(),
            currentAvailabilities.map { it.day.ordinal }.toSet(),
            newAvailabilities.map { it.day.ordinal }.toSet(),
        )
    }
}