package no.itx.lunchscheme.i18n.dto

import no.itx.lunchscheme.i18n.db.entities.Text

data class TextDto(
    val id: Long?,
    val systemKey: String?,
    val content: String,
    val translations: Map<String, String>
) {
    companion object {
        fun from(text: Text) = TextDto(
            text.id,
            text.systemKey,
            text.content,
            text.translations.toMap()
        )
    }
}