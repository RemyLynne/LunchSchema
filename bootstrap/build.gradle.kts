plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.kotlin.jpa)
    alias(libs.plugins.kotlin.spring)
    alias(libs.plugins.spring.boot)
    alias(libs.plugins.spring.dep.mgmt)
}

dependencies {
    developmentOnly(libs.spring.boot.devtools)
    implementation(libs.spring.boot.starter)
    implementation(libs.spring.boot.starter.actuator)
    testImplementation(libs.spring.boot.starter.test)
    implementation(libs.spring.boot.starter.web)

    implementation(libs.spring.boot.starter.data.jpa)
    implementation(libs.spring.boot.starter.flyway)
    implementation(libs.flyway.core)
    implementation(libs.flyway.mysql)
    implementation(libs.mysql.connector.j)

    implementation(project(":common:banner"))
    implementation(project(":common:constants"))
    implementation(project(":common:i18n"))

    implementation(project(":frontend"))
}

tasks.bootJar {
    enabled = true
}

tasks.jar {
    enabled = false
}
