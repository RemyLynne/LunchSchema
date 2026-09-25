package no.itx.lunchscheme.iam.db.repositories

import no.itx.lunchscheme.iam.db.entities.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : JpaRepository<User, Long>