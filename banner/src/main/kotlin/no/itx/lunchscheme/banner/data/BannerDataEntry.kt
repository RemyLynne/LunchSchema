package no.itx.lunchscheme.banner.data

sealed class BannerDataEntry {
    data class Single(val str: String) : BannerDataEntry()
    data class Pair(val first: String, val second: String) : BannerDataEntry()

    companion object {
        operator fun invoke(str: String): BannerDataEntry = Single(str)
        operator fun invoke(first: String, second: String): BannerDataEntry = Pair(first, second)
    }
}