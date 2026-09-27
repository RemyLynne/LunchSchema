package no.itx.lunchscheme.iam.db.repositories

import no.itx.lunchscheme.iam.db.entities.Role
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface RoleRepository : JpaRepository<Role, Long>