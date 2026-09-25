package no.itx.lunchscheme.iam.db.repositories

import no.itx.lunchscheme.iam.db.entities.UserToken
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserTokenRepository : JpaRepository<UserToken, Long>