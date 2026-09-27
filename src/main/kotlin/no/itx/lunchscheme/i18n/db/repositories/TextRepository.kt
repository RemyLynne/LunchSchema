package no.itx.lunchscheme.i18n.db.repositories

import no.itx.lunchscheme.i18n.db.entities.Text
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface TextRepository : JpaRepository<Text, Long>