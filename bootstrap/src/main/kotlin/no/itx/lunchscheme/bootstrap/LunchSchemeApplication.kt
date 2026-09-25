package no.itx.lunchscheme.bootstrap

import org.springframework.boot.Banner
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication

@SpringBootApplication
open class LunchSchemeApplication

fun main(args: Array<String>) {
    val app = SpringApplication(LunchSchemeApplication::class.java)

    app.setBannerMode(Banner.Mode.LOG)
    app.setBanner(StartupBanner())

    app.run(*args);
}