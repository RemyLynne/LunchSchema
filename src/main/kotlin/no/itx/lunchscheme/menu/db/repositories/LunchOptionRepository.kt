package no.itx.lunchscheme.menu.db.repositories

import no.itx.lunchscheme.menu.db.entities.LunchOption
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDate
import java.util.Optional

@Repository
interface LunchOptionRepository : JpaRepository<LunchOption, Int> {
    fun findByEndDateIsNullOrEndDateAfter(endDate: LocalDate): MutableList<LunchOption>
    fun findByIdAndEndDateIsNull(id: Int): Optional<LunchOption>
    @Query("""
        SELECT o FROM LunchOption o
        WHERE o.id = :id
          AND (o.endDate IS NULL OR o.endDate >= :date)
    """)
    fun findByIdAndEndDateMaybeAfter(id: Int, date: LocalDate): Optional<LunchOption>
}