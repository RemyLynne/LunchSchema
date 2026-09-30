package no.itx.lunchscheme.menu.db.repositories

import no.itx.lunchscheme.menu.db.entities.LunchOption
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface LunchOptionRepository : JpaRepository<LunchOption, Int>