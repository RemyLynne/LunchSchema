package no.itx.lunchscheme.iam.db.entities

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import no.itx.lunchscheme.i18n.db.entities.Text
import no.itx.lunchscheme.iam.web.dto.PermissionDto
import no.itx.lunchscheme.web.WithResponseDto

@Entity
@Table(name = "permissions")
class Permission(
    @Column(name = "name", length = 150, unique = true, nullable = false)
    var name: String,
    @OneToOne(optional = false)
    @JoinColumn(name = "title_text_id", nullable = false)
    var title: Text
) : WithResponseDto<PermissionDto> {
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    var id: Int? = null
        protected set

    override fun toDto() = PermissionDto(id, name, title.toDto())
}