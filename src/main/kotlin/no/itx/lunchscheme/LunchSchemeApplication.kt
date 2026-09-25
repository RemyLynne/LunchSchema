package no.itx.lunchscheme

import org.springframework.boot.Banner
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication

@SpringBootApplication
class LunchSchemeApplication

fun main(args: Array<String>) {
    val app = SpringApplication(LunchSchemeApplication::class.java)

    app.setBannerMode(Banner.Mode.LOG)
    app.setBanner(StartupBanner())

    app.run(*args)
}