val rootDir: Directory = project.layout.projectDirectory.dir("..")
val frontendDir: Directory = rootDir.dir("WebContent")
val frontendBuildDir: Directory = frontendDir.dir("dist")

plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.kotlin.spring)
    alias(libs.plugins.spring.boot)
    alias(libs.plugins.spring.dep.mgmt)
}

dependencies {
    implementation(libs.spring.boot.starter)
    implementation(libs.spring.boot.starter.web)
    implementation(project(":common:web"))
}

val copy = tasks.register<Copy>("copyFrontendToResources") {
    from(frontendBuildDir)
    into(layout.buildDirectory.dir("resources/main/static"))
}

tasks.named<ProcessResources>("processResources") {
    dependsOn(copy)
}