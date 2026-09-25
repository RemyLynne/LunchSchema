package no.itx.lunchscheme.banner

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import no.itx.lunchscheme.banner.data.BannerDataBlock
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class BannerTest {
    @Test
    fun `render outputs nothing when title, description and data are empty`() {
        val banner = Banner()
        val out = banner.render()
        assertEquals("", out)
    }

    @Test
    fun `render outputs description when set`() {
        val description = "hello\n"
        val banner = Banner(description = description)
        val out = banner.render()
        assertEquals(description, out)
    }

    @Test
    fun `render outputs something when title is set`() {
        val banner = Banner(title = "My App")

        val out = banner.render()
        assertTrue(out.isNotEmpty())
    }

    @Test
    fun `render outputs delimiter line and data block for each block`() {
        val res1 = "BLOCK1"
        val res2 = "BLOCK2"

        val width = 50
        val banner = Banner()
        val block1 = mockk<BannerDataBlock>()
        val block2 = mockk<BannerDataBlock>()

        every { block1.build(width) } returns res1
        every { block2.build(width) } returns res2

        banner.data.add(block1)
        banner.data.add(block2)

        val out = banner.render()

        val delimiter = "\n" + "=".repeat(width) + "\n"
        assertTrue(out.contains(delimiter + res1), "Expected $res1 section")
        assertTrue(out.contains(delimiter + res2), "Expected $res2 section")

        verify { block1.build(width) }
        verify { block2.build(width) }
    }

    @Test
    fun `render uses delimiterChar`() {
        val char = '-'
        val banner = Banner(delimiterChar = char)

        val block = mockk<BannerDataBlock>()
        every { block.build(50) } returns "X"
        banner.data.add(block)

        val out = banner.render()

        assertTrue(out.contains(char.toString().repeat(50)))
        verify { block.build(50) }
    }
}