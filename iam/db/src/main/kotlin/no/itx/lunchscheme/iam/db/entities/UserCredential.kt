package no.itx.lunchscheme.iam.db.entities

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.MapsId
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import java.time.Instant

@Entity
@Table(name = "user_credentials")
class UserCredential(
    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, updatable = false)
    @MapsId
    var user: User,
    @Column(nullable = false)
    var hash: String
) {
    @Id
    @Column(name = "user_id", nullable = false, updatable = false)
    var id: Long? = null
        protected set
    @Column(name = "last_changed_at", nullable = false)
    var lastChangedAt: Instant = Instant.now()
}
