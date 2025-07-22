
import { createApp } from "vue"
import App from "./app.vue"
import ui from '@nuxt/ui/vue-plugin'
import { createRouter, createWebHistory } from 'vue-router'
import "./index.css"

const app = createApp(App)

const router = createRouter({
  routes: [],
  history: createWebHistory()
})

app.use(router)
app.use(ui)

app.mount("#app")


self.onerror = function (message, source, lineno, colno, error) {
  console.info("Error: " + message)
  console.info("Source: " + source)
  console.info("Line: " + lineno)
  console.info("Column: " + colno)
  console.info("Error object: " + error)
}
