plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0"
}
rootProject.name = "root"

include(
    ":banner",
    ":bootstrap",
    ":constants"
)

project(":banner").projectDir = file("../banner")
project(":bootstrap").projectDir = file("../bootstrap")
project(":constants").projectDir = file("../constants")