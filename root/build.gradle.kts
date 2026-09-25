import org.gradle.kotlin.dsl.configure
import org.gradle.kotlin.dsl.named
import org.jetbrains.kotlin.gradle.dsl.KotlinJvmProjectExtension
import org.springframework.boot.gradle.tasks.bundling.BootJar

plugins {
    alias(libs.plugins.kotlin.jvm) apply false
    alias(libs.plugins.kotlin.spring) apply false
    alias(libs.plugins.spring.boot) apply false
    alias(libs.plugins.spring.dep.mgmt) apply false
}

allprojects {
    group = "no.itx.lunsjordning"
    version = property("rootProject.version") as String

    repositories {
        mavenCentral()
    }
}

subprojects {
    pluginManager.withPlugin("org.jetbrains.kotlin.jvm") {
        extensions.configure<KotlinJvmProjectExtension> {
            jvmToolchain(25)
            compilerOptions {
                freeCompilerArgs.addAll("-Xjsr305=strict")
            }
        }
        dependencies {
            "testRuntimeOnly"(libs.junit.platform.launcher)
            "testImplementation"(libs.kotlin.test.junit5)
            "testImplementation"(libs.mockk)
            "implementation"(libs.kotlin.reflect)
        }
    }
    tasks.withType<Test> {
        useJUnitPlatform()
    }
    tasks.withType<Jar>().configureEach {
        archiveBaseName.set(project.path.removePrefix(":").replace(":", "-"))
    }
    plugins.withId("org.springframework.boot") {
        tasks.named<BootJar>("bootJar").configure {
            enabled = false
        }
        tasks.named<Jar>("jar").configure {
            enabled = true
        }
    }
}