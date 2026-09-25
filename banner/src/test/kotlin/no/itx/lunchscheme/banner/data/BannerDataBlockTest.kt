package no.itx.lunchscheme.banner.data

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class BannerDataBlockTest {
    @Test
    fun `build returns empty when no title and no entries`() {
        val block = BannerDataBlock()

        assertEquals("", block.build(50))
    }

    @Test
    fun `build renders single entries each on a new line`() {
        val res1 = "one"
        val res2 = "two"

        val block = BannerDataBlock(
            entries = mutableListOf(
                BannerDataEntry.Single(res1),
                BannerDataEntry.Single(res2),
            )
        )

        val out = block.build(50)
        assertEquals("\n$res1\n$res2", out)
    }

    @Test
    fun `build aligns pair keys to max key length among pairs`() {
        val k1 = "a"
        val vA = "1"
        val k7 = "longKey"
        val vB = "2"

        val block = BannerDataBlock(
            entries = mutableListOf(
                BannerDataEntry.Pair(k1, vA),
                BannerDataEntry.Pair(k7, vB),
            )
        )

        val out = block.build(50)

        // max key length = 7 ("longKey")
        assertEquals(
            "\n" +
                    "$k1       : $vA\n" +
                    "$k7 : $vB",
            out
        )
    }

    @Test
    fun `build max pair key length ignores single entries`() {
        val res1 = "SINGLE"
        val k2 = "aa"
        val vA = "1"
        val k4 = "bbbb"
        val vB = "2"

        val block = BannerDataBlock(
            entries = mutableListOf(
                BannerDataEntry.Single(res1),
                BannerDataEntry.Pair(k2, vA),
                BannerDataEntry.Pair(k4, vB),
            )
        )

        val out = block.build(50)

        // max key length = 4 ("bbbb"), so "aa" gets padded to 4
        assertEquals(
            "\n" +
                    "$res1\n" +
                    "$k2   : $vA\n" +
                    "$k4 : $vB",
            out
        )
    }

    @Test
    fun `build includes padded title when present`() {
        val title = "HELLO"
        val value = "x"

        val block = BannerDataBlock(
            title = title,
            entries = mutableListOf(
                BannerDataEntry.Single(value),
            )
        )

        val out = block.build(21)

        val expectedPrefix = " ".repeat(8) + title + " ".repeat(8)

        assertTrue(out.startsWith(expectedPrefix), "Expected title line prefix")
        assertTrue(out.contains("\n$value"), "Expected entries after title")
    }

    @Test
    fun `padded title size matches titleWidth - even title`() {
        val title = "EVEN"

        val block = BannerDataBlock(
            title = title
        )

        val outEven = block.build(10)
        val expectedEven = " ".repeat(3) + title + " ".repeat(3) // 3+4+3 = 10
        val outOdd = block.build(11)
        val expectedOdd = " ".repeat(3) + title + " ".repeat(4) // 3+4+4 = 11

        assertEquals(expectedEven, outEven)
        assertEquals(expectedOdd, outOdd)
    }

    @Test
    fun `padded title size matches titleWidth - odd title`() {
        val title = "ODD"

        val block = BannerDataBlock(
            title = title
        )

        val outOdd = block.build(11)
        val expectedOdd = " ".repeat(4) + title + " ".repeat(4) // 4+3+4 = 11
        val outEven = block.build(10)
        val expectedEven = " ".repeat(4) + title + " ".repeat(3) // 4+3+3 = 10

        assertEquals(expectedOdd, outOdd)
        assertEquals(expectedEven, outEven)
    }

    @Test
    fun `no padding on title when title longer that titleWidth`() {
        val title = "HELLO WORLD"

        val block = BannerDataBlock(
            title = title
        )

        val out = block.build(5)

        assertEquals(title, out)
    }
}