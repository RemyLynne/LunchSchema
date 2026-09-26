import "@/main.css"

void load()

async function load() {
  try {
    const { load } = await import("@/main-app-loader")
    load()
  } catch (error) {
    console.error(error)

    // WARNING! In iOS and WebViews, the synchronous nature of window.alert is NOT guaranteed (might be skipped)
    window.alert("An unexpected error occurred. Window will reload.")
    setTimeout(() => location.reload(), 100)
  }
}