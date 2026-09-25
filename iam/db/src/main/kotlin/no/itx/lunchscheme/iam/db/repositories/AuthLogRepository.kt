package no.itx.lunchscheme.iam.db.repositories

import no.itx.lunchscheme.iam.db.entities.AuthLog
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface AuthLogRepository : JpaRepository<AuthLog, Long>