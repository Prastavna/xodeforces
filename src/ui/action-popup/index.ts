
import { createApp } from "vue"
import App from "./app.vue"

const app = createApp(App)

app.mount("#app")

export default app


self.onerror = function (message, source, lineno, colno, error) {
  console.info("Error: " + message)
  console.info("Source: " + source)
  console.info("Line: " + lineno)
  console.info("Column: " + colno)
  console.info("Error object: " + error)
}
