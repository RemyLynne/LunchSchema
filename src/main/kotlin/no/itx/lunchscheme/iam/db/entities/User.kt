package no.itx.lunchscheme.iam.db.entities

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.Table
import no.itx.lunchscheme.iam.web.dto.UserDto
import no.itx.lunchscheme.web.WithResponseDto
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.Instant

@Entity
@Table(name = "users")
class User(
    @Column(name = "email", nullable = false, unique = true, updatable = false)
    var email: String,
    @Column(name = "name", nullable = false, unique = true)
    var name: String,
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "users_roles",
        joinColumns = [JoinColumn(name = "user_id")],
        inverseJoinColumns = [JoinColumn(name = "role_id")],
    )
    var roles: MutableSet<Role> = mutableSetOf(),
    @Column(nullable = false)
    var disabled: Boolean = false
) : WithResponseDto<UserDto> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    var id: Int? = null
        protected set
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant? = null
        protected set
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant? = null
        protected set

    override fun toDto() = UserDto(id, email, name, createdAt, updatedAt, roles.map(Role::toDto).toSet(), disabled)
}
