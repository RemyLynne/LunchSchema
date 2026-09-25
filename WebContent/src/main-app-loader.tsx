import React from "react"
import ReactDOM from "react-dom/client"
import App from "@/app"
import "@/i18n"

export function load() {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
