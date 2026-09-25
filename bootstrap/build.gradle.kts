plugins {
    alias(libs.plugins.kotlin.jvm)
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
