package no.itx.lunchscheme.bootstrap

import org.springframework.boot.Banner
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.persistence.autoconfigure.EntityScan
import org.springframework.context.annotation.ComponentScan
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@SpringBootApplication
@ComponentScan(basePackages = ["no.itx.lunchscheme"])
@EnableJpaRepositories(basePackages = ["no.itx.lunchscheme"])
@EntityScan(basePackages = ["no.itx.lunchscheme"])
class LunchSchemeApplication

fun main(args: Array<String>) {
    val app = SpringApplication(LunchSchemeApplication::class.java)

    app.setBannerMode(Banner.Mode.LOG)
    app.setBanner(StartupBanner())

    app.run(*args)
}