package no.itx.lunchscheme.bootstrap

import no.itx.lunchscheme.banner.Banner
import no.itx.lunchscheme.banner.data.BannerDataBlock
import no.itx.lunchscheme.banner.data.BannerDataEntry
import no.itx.lunchscheme.constants.SpringPropertiesConstants
import org.springframework.boot.ansi.AnsiColor
import org.springframework.boot.ansi.AnsiOutput
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.core.env.Environment
import java.io.PrintStream
import java.lang.management.ManagementFactory
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import org.springframework.boot.Banner as SpringBanner

class StartupBanner : SpringBanner {
    private val poweredByLine = " :: Powered by Spring Boot :: "
    private val runningUnbuilt = "⚠ Running non-built version (IDE/classes)"

    override fun printBanner(
        environment: Environment,
        sourceClass: Class<*>?,
        out: PrintStream
    ) {
        if (sourceClass == null)
            throw IllegalArgumentException("Missing sourceClass")
        val banner = create(environment, sourceClass)
        out.println(AnsiOutput.toString(AnsiColor.DEFAULT)) //force color reset
        banner.print(out)
    }

    fun create(
        environment: Environment,
        sourceClass: Class<*>
    ) = Banner(
        title = environment.getProperty(SpringPropertiesConstants.APP_NAME),
        description = AnsiOutput.toString(AnsiColor.GREEN, poweredByLine),
        data = mutableListOf(
            createVersionEntry(environment, sourceClass),
            createServiceEntry(environment)
        )
    )

    fun createVersionEntry(
        environment: Environment,
        sourceClass: Class<*>
    ): BannerDataBlock {
        val block = BannerDataBlock(
            title = "-- Version --"
        )

        block.entries.add(
            BannerDataEntry(
                "Spring Boot",
                SpringBootApplication::class.java.`package`.implementationVersion
            )
        )

        val name = environment.getProperty(SpringPropertiesConstants.APP_NAME)!!

        if (sourceClass.`package`.implementationVersion == null)
            block.entries.add(BannerDataEntry(AnsiOutput.toString(AnsiColor.YELLOW, runningUnbuilt)))

        return block
    }

    fun createServiceEntry(environment: Environment): BannerDataBlock {
        val block = BannerDataBlock(
            title = "-- Service --"
        )

        // Start Time
        block.entries.add(
            BannerDataEntry(
                "Start Time",
                Instant.ofEpochMilli(ManagementFactory.getRuntimeMXBean().startTime)
                    .atZone(ZoneId.systemDefault())
                    .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)
            )
        )

        //Profiles
        val profiles = environment.activeProfiles
        if (profiles.isNotEmpty())
            block.entries.add(BannerDataEntry("Profiles", profiles.joinToString()))

        return block
    }
}