
import { createApp } from "vue"
import App from "./app.vue"

// router.beforeEach((to, from, next) => {
//   if (to.path === '/') {
//     return next('/action-popup')
//   }

//   next()
// })

console.log("X11")
// alert("hii")

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
