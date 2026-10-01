package no.itx.lunchscheme.menu.db.repositories

import no.itx.lunchscheme.iam.db.entities.User
import no.itx.lunchscheme.menu.db.entities.UserChoice
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDate

@Repository
interface UserChoiceRepository : JpaRepository<UserChoice, Int> {
    @Query("""
        SELECT c FROM UserChoice c
        WHERE c.user = :user
            AND (c.endDate IS NULL OR c.endDate >= :date)
    """)
    fun findByUserAndEndDateMaybeAfter(user: User, date: LocalDate): MutableList<UserChoice>
}