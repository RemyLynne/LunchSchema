package no.itx.lunchscheme.i18n.db.entities

import jakarta.persistence.CollectionTable
import jakarta.persistence.Column
import jakarta.persistence.ElementCollection
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.MapKeyColumn
import jakarta.persistence.Table
import no.itx.lunchscheme.i18n.dto.TextDto
import no.itx.lunchscheme.web.WithResponseDto

@Entity
@Table(name = "texts")
class Text(
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    var content: String
) : WithResponseDto<TextDto> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    var id: Long? = null
        protected set
    @Column(name = "system_key", length = 50, unique = true)
    var systemKey: String? = null
        protected set
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "text_translations",
        joinColumns = [JoinColumn(name = "text_id")],
    )
    @MapKeyColumn(name = "language", length = 10)
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    var translations: MutableMap<String, String> = mutableMapOf()

    override fun toDto() = TextDto(id, systemKey, content, translations.toMap())

    companion object {
        fun fromDto(dto: TextDto) = Text(dto.content).apply {
            id = dto.id
            translations = dto.translations.toMutableMap()
        }
    }
}