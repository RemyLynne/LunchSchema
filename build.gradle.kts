val rootDir: Directory = project.layout.projectDirectory.dir(".")
val frontendDir: Directory = rootDir.dir("WebContent")
val frontendBuildDir: Directory = frontendDir.dir("dist")

plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.kotlin.jpa)
    alias(libs.plugins.kotlin.spring)
    alias(libs.plugins.spring.boot)
    alias(libs.plugins.spring.dep.mgmt)
}

group = "no.itx.lunchscheme"
version = property("rootProject.version") as String

repositories {
    mavenCentral()
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

dependencies {
    developmentOnly(libs.spring.boot.devtools)

    implementation(libs.flyway.core)
    implementation(libs.flyway.mysql)
    implementation(libs.jfiglet)
    implementation(libs.kotlin.reflect)
    implementation(libs.mysql.connector.j)
    implementation(libs.spring.boot.starter)
    implementation(libs.spring.boot.starter.actuator)
    implementation(libs.spring.boot.starter.data.jpa)
    implementation(libs.spring.boot.starter.flyway)
    implementation(libs.spring.boot.starter.security)
    implementation(libs.spring.boot.starter.validation)
    implementation(libs.spring.boot.starter.web)

    testRuntimeOnly(libs.junit.platform.launcher)
    testImplementation(libs.kotlin.test.junit5)
    testImplementation(libs.mockk)
    testImplementation(libs.spring.boot.starter.test)
}

tasks.withType<Test> {
    useJUnitPlatform()
}

val copy = tasks.register<Copy>("copyFrontendToResources") {
    from(frontendBuildDir)
    into(layout.buildDirectory.dir("resources/main/static"))
}

tasks.named<ProcessResources>("processResources") {
    dependsOn(copy)
}