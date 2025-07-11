import { name } from "../../package.json"

const src = chrome.runtime.getURL("src/ui/content-script-iframe/index.html")

const iframe = new DOMParser().parseFromString(
  `<iframe class="crx-iframe ${name}" src="${src}" title="${name}" sandbox="allow-scripts allow-same-origin"></iframe>`,
  "text/html",
).body.firstElementChild

if (iframe) {
  document.body?.prepend(iframe)
}

self.onerror = function (message, source, lineno, colno, error) {
  console.info("Error: " + message)
  console.info("Source: " + source)
  console.info("Line: " + lineno)
  console.info("Column: " + colno)
  console.info("Error object: " + error)
}
