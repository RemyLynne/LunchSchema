package no.itx.lunchscheme.bootstrap

import no.itx.lunchscheme.banner.Banner
import no.itx.lunchscheme.banner.data.BannerDataBlock
import no.itx.lunchscheme.constants.SpringPropertiesConstants
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.assertThrows
import org.springframework.boot.ansi.AnsiOutput
import org.springframework.mock.env.MockEnvironment
import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test
import kotlin.test.assertContains
import kotlin.test.assertEquals

class StartupBannerTest {
    lateinit var env: MockEnvironment
    lateinit var sb: StartupBanner
    lateinit var banner: Banner
    lateinit var versionBlock: BannerDataBlock
    lateinit var serviceBlock: BannerDataBlock

    @BeforeEach
    fun disableAnsi() {
        AnsiOutput.setEnabled(AnsiOutput.Enabled.NEVER)
    }

    @BeforeEach
    fun setupEnvironment() {
        env = MockEnvironment()
            .withProperty(SpringPropertiesConstants.APP_NAME, "Lunch Scheme")

        sb = StartupBanner()
    }

    fun build() {
        banner = sb.create(env, DummySource::class.java)
        versionBlock = sb.createVersionEntry(env, DummySource::class.java)
        serviceBlock = sb.createServiceEntry(env)
    }

    @Test
    fun `printBanner throws when sourceClass is null`() {
        val env = MockEnvironment()
        val out = PrintStream(ByteArrayOutputStream())

        assertThrows<IllegalArgumentException> {
            sb.printBanner(env, null, out)
        }
    }

    @Test
    fun `create builds banner with title description and two data blocks`() {
        val title = "Some Title"
        env.setProperty(SpringPropertiesConstants.APP_NAME, title)

        build()

        assertEquals(title, banner.title)
        assertContains(banner.description!!, "Powered by Spring Boot")

        assertEquals(2, banner.data.size)
    }

    private class DummySource
}