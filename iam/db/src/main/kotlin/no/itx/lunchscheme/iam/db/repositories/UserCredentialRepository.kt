package no.itx.lunchscheme.iam.db.repositories

import no.itx.lunchscheme.iam.db.entities.UserCredential
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserCredentialRepository : JpaRepository<UserCredential, Long>