plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0"
}
rootProject.name = "root"

include(
    ":bootstrap",

    ":common:banner",
    ":common:constants",
    ":common:i18n",
    ":common:web",

    ":frontend",

    ":iam",
    ":iam:db",
    ":iam:web"
)

project(":bootstrap").projectDir = file("../bootstrap")

project(":common").projectDir = file("../common")
project(":common:banner").projectDir = file("../common/banner")
project(":common:constants").projectDir = file("../common/constants")
project(":common:i18n").projectDir = file("../common/i18n")
project(":common:web").projectDir = file("../common/web")

project(":frontend").projectDir = file("../frontend")

project(":iam").projectDir = file("../iam")
project(":iam:db").projectDir = file("../iam/db")
project(":iam:web").projectDir = file("../iam/web")