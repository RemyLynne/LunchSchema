package no.itx.lunchscheme.iam.web.controller

import no.itx.lunchscheme.iam.PermissionConstant
import no.itx.lunchscheme.iam.db.entities.Role
import no.itx.lunchscheme.iam.db.repositories.RoleRepository
import no.itx.lunchscheme.iam.web.dto.RoleDto
import no.itx.lunchscheme.web.WebConstants.API_BASE
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("$API_BASE/roles")
class RoleController(
    private val roleRepository: RoleRepository
) {
    @GetMapping
    @PreAuthorize("hasAuthority('${PermissionConstant.ROLES_VIEW}')")
    fun getRoles(): ResponseEntity<List<RoleDto>> {
        val roles = roleRepository.findAll().toList()

        return ResponseEntity.ok(roles.map(Role::toDto))
    }
}