package no.itx.lunchscheme.iam.db.entities

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import jakarta.persistence.Transient
import org.hibernate.annotations.CreationTimestamp
import java.time.Instant

@Entity
@Table(name = "user_tokens")
class UserToken(
    @ManyToOne(optional = false)
    @JoinColumn("user_id", nullable = false, updatable = false)
    var user: User,
    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false, updatable = false)
    var type: UserTokenType,
    @Column(nullable = false, updatable = false)
    var hash: String,
    @ManyToOne
    @JoinColumn(name = "session_id", updatable = false)
    var session: UserSession?,
    @Column(name = "expires_at", nullable = false)
    var expiresAt: Instant,
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null
        protected set
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant? = null
        protected set
    @Column(name = "consumed_at")
    var consumedAt: Instant? = null

    @get:Transient
    private val expired: Boolean
        get() = expiresAt.isBefore(Instant.now())
    @get:Transient
    val active: Boolean
        get() = consumedAt == null && !expired

    enum class UserTokenType {
        SESSION_REFRESH
    }
}
