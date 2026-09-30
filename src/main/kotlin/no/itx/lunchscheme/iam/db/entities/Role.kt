package no.itx.lunchscheme.iam.db.entities

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import no.itx.lunchscheme.i18n.db.entities.Text
import no.itx.lunchscheme.iam.web.dto.RoleDto
import no.itx.lunchscheme.web.WithResponseDto

@Entity
@Table(name = "roles")
class Role(
    @OneToOne(optional = false, orphanRemoval = true)
    @JoinColumn(name = "title_text_id", nullable = false)
    var title: Text,
    @Column(name = "sort", nullable = false)
    var sort: Int
) : WithResponseDto<RoleDto> {
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    var id: Int? = null
        protected set
    @Column(name = "system_key", length = 50, unique = true)
    var systemKey: String? = null
        protected set
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "roles_permissions",
        joinColumns = [JoinColumn(name = "role_id")],
        inverseJoinColumns = [JoinColumn(name = "permission_id")],
    )
    var permissions: MutableSet<Permission> = mutableSetOf()

    override fun toDto() = RoleDto(id, systemKey, title.toDto(), sort, permissions.map(Permission::toDto).toSet())
}