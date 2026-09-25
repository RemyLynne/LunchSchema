package no.itx.lunchscheme.iam.db.entities

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.hibernate.annotations.CreationTimestamp
import java.time.Instant

@Entity
@Table(name = "user_sessions")
class UserSession(
    @ManyToOne(optional = false)
    @JoinColumn("user_id", nullable = false, updatable = false)
    var user: User,
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
    @Column(name = "last_seen_at", nullable = false)
    var lastSeenAt: Instant = Instant.now()
    @Column(name = "revoked_at")
    var revokedAt: Instant? = null
}