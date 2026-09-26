import React from "react"
import ReactDOM from "react-dom/client"
import App from "@/app"

export function load() {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
