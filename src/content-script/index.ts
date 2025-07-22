import { name } from "../../package.json"

const src = chrome.runtime.getURL("src/ui/content-script-iframe/index.html")

const codeforcesBody = document.getElementById("body");

const submitBtn = document.getElementById("sidebarSubmitButton")
if (submitBtn) {
  const button = document.createElement("input")
  button.type = "button"
  button.style.width = submitBtn.style.width
  button.style.fontSize = submitBtn.style.fontSize
  button.classList.add("submit")
  button.value = "Open Editor"
  submitBtn.parentNode?.insertBefore(button, submitBtn)

  button.onclick = () => {
    const iframe = createIframe();
    if (iframe && codeforcesBody) {
      const isVisible = iframe.style.display !== 'none';
      document.body.style.margin = isVisible ? '0' : 'unset';
      codeforcesBody.style.margin = isVisible ? '0 auto' : 'unset';
      // codeforcesBody.style.overflowX = isVisible ? 'hidden' : 'unset';
      codeforcesBody.style.overflowY = isVisible ? 'auto' : 'hidden';
      iframe.style.display = isVisible ? 'none' : 'block';
    }
  }
}


let iframe: HTMLElement | null = null;

function createIframe() {
  if (iframe) return iframe;

  if (codeforcesBody) {    
    const wrapper = document.createElement("div")
    wrapper.id = "codeforces-body-wrapper"
    wrapper.style.width = "100%"
    wrapper.style.height = "100%"
    wrapper.style.display = "flex"
    wrapper.style.position = "relative"
    
    codeforcesBody.parentNode?.insertBefore(wrapper, codeforcesBody)
    wrapper.appendChild(codeforcesBody)
  }
  
  iframe = new DOMParser().parseFromString(
    `<iframe class="crx-iframe ${name}" src="${src}" title="${name}" sandbox="allow-scripts allow-same-origin" style="display: none; width: 100%; height: 100dvh; position: sticky; top: 0; border: none; background: white;"></iframe>`,
    "text/html",
  ).body.firstElementChild as HTMLElement;

  if (iframe && codeforcesBody) {
    codeforcesBody.parentNode?.appendChild(iframe)
  }
  
  return iframe;
}

createIframe();

self.onerror = function (message, source, lineno, colno, error) {
  console.info("Error: " + message)
  console.info("Source: " + source)
  console.info("Line: " + lineno)
  console.info("Column: " + colno)
  console.info("Error object: " + error)
}
