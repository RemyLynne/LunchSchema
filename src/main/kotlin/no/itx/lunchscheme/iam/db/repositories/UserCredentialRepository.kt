package no.itx.lunchscheme.iam.db.repositories

import no.itx.lunchscheme.iam.db.entities.User
import no.itx.lunchscheme.iam.db.entities.UserCredential
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface UserCredentialRepository : JpaRepository<UserCredential, Int> {
    fun findByUser(user: User): Optional<UserCredential>
}