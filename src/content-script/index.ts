import { name } from "../../package.json"

const src = chrome.runtime.getURL("src/ui/content-script-iframe/index.html")

const submitBtnId = "sidebarSubmitButton";

// add a button before the submit button
const submitBtn = document.getElementById(submitBtnId)
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
    if (iframe) {
      const isVisible = iframe.style.display !== 'none';
      iframe.style.display = isVisible ? 'none' : 'block';
    }
  }
}


let iframe: HTMLElement | null = null;
const codeforcesBody = document.getElementById("body");

function createIframe() {
  if (iframe) return iframe;

  // wrap the codeforces body in a div
  if (codeforcesBody) {
    codeforcesBody.style.width = "50%"
    codeforcesBody.style.margin = 'unset'
    
    const wrapper = document.createElement("div")
    wrapper.id = "codeforces-body-wrapper"
    wrapper.style.width = "100%"
    wrapper.style.height = "100%"
    wrapper.style.display = "flex"
    
    codeforcesBody.parentNode?.insertBefore(wrapper, codeforcesBody)
    wrapper.appendChild(codeforcesBody)
  }
  
  iframe = new DOMParser().parseFromString(
    `<iframe class="crx-iframe ${name}" src="${src}" title="${name}" sandbox="allow-scripts allow-same-origin" style="display: none; width: 100%; height: 100vh; position: sticky; top: 0; left: 0; z-index: 9999; border: none; background: white;"></iframe>`,
    "text/html",
  ).body.firstElementChild as HTMLElement;

  if (iframe) {
    // append iframe to the wrapper
    if (codeforcesBody) {
      codeforcesBody.parentNode?.appendChild(iframe)
    }
  }
  
  return iframe;
}

// Create iframe on load
// createIframe();

self.onerror = function (message, source, lineno, colno, error) {
  console.info("Error: " + message)
  console.info("Source: " + source)
  console.info("Line: " + lineno)
  console.info("Column: " + colno)
  console.info("Error object: " + error)
}
