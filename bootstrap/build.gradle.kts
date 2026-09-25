plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.kotlin.spring)
    alias(libs.plugins.spring.boot)
    alias(libs.plugins.spring.dep.mgmt)
}

dependencies {
    developmentOnly(libs.spring.boot.devtools)
    implementation(libs.spring.boot.starter)
    testImplementation(libs.spring.boot.starter.test)
    implementation(project(":banner"))
    implementation(project(":constants"))
}

tasks.bootJar {
    enabled = true
}

tasks.jar {
    enabled = false
}
