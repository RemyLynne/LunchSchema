package no.itx.lunchscheme.common.banner.data

class BannerDataBlock(
    var title: String? = null,
    val entries: MutableList<BannerDataEntry> = mutableListOf()
) {
    fun build(commonWidth: Int): String {
        val builder = StringBuilder()

        val title = title
        if (title != null) {
            val halfTotalWidth = commonWidth / 2
            val halfTitleWidth = title.length / 2

            val paddingSizeBefore = halfTotalWidth - halfTitleWidth
            val paddingBefore = " ".repeat(paddingSizeBefore.coerceAtLeast(0))

            val paddingSizeAfter = commonWidth - (paddingSizeBefore + title.length)
            val paddingAfter = " ".repeat(paddingSizeAfter.coerceAtLeast(0))

            builder.append(paddingBefore + title + paddingAfter)
        }

        val entries = entries
        val maxPairFirstLength = entries.filterIsInstance<BannerDataEntry.Pair>()
            .maxOfOrNull { it.first.length } ?: 0

        for (entry in entries) {
            val value: String = when (entry) {
                is BannerDataEntry.Pair ->
                    "${entry.first.padEnd(maxPairFirstLength)} : ${entry.second}"
                is BannerDataEntry.Single ->
                    entry.str
            }
            builder.append("\n$value")
        }

        return builder.toString()
    }
}