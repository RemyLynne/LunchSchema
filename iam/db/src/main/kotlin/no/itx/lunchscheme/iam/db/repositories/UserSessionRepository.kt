package no.itx.lunchscheme.iam.db.repositories

import no.itx.lunchscheme.iam.db.entities.UserSession
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserSessionRepository : JpaRepository<UserSession, Long>