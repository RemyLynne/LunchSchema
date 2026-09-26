package no.itx.lunchscheme.iam.db.entities

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import java.time.Instant

@Entity
@Table(name = "auth_logs")
class AuthLog(
    @OneToOne
    @JoinColumn(name = "user_id", updatable = false)
    var user: User?,
    @Column(updatable = false)
    var ip: String?,
    @Column(name = "user_agent", updatable = false)
    var userAgent: String?,
    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false, updatable = false)
    var action: AuthLogAction,
    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false, updatable = false)
    var result: AuthLogResult,
    @Column(updatable = false)
    var reason: String?
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null
        protected set
    @Column(name = "occurred_at", nullable = false, updatable = false)
    var occurredAt: Instant = Instant.now()

    enum class AuthLogAction {
        LOGIN,
        REGISTER,
        LOGOUT
    }

    enum class AuthLogResult {
        SUCCESS,
        FAILURE
    }
}