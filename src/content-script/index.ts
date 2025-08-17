import { name } from "../../package.json";
import { storage } from "../services/storage";

const src = chrome.runtime.getURL("src/ui/content-script-iframe/index.html");

const codeforcesBody = document.getElementById("body");

const submitBtn = document.getElementById("sidebarSubmitButton");

// Storage key for iframe width
const IFRAME_WIDTH_KEY = "codeforces-iframe-width";

if (submitBtn) {
	const button = document.createElement("input");
	button.type = "button";
	button.style.width = submitBtn.style.width;
	button.style.fontSize = submitBtn.style.fontSize;
	button.classList.add("submit");
	button.value = "Open Editor";
	submitBtn.parentNode?.insertBefore(button, submitBtn);

	button.onclick = () => {
		const iframe = createIframe();
		if (iframe && codeforcesBody) {
			const isVisible = iframe.style.display !== "none";
			button.value = isVisible ? "Open Editor" : "Close Editor";
			document.body.style.margin = isVisible ? "0" : "unset";
			codeforcesBody.style.margin = isVisible ? "0 auto" : "unset";
			codeforcesBody.style.overflowY = isVisible ? "auto" : "hidden";
			codeforcesBody.style.maxWidth = isVisible ? "1200px" : "unset";
			codeforcesBody.style.minWidth = isVisible ? "920px" : "unset";
			iframe.style.display = isVisible ? "none" : "flex";
		}
	};
}

let iframe: HTMLElement | null = null;
let resizeHandle: HTMLElement | null = null;
let resizeOverlay: HTMLElement | null = null;

function getSavedWidth(): number {
	const saved = storage.local.get(IFRAME_WIDTH_KEY);
	return saved ? parseFloat(saved) : 50; // Default to 50%
}

function saveWidth(widthPercentage: number) {
	storage.local.set(IFRAME_WIDTH_KEY, widthPercentage.toString());
}

function createIframe() {
	if (iframe) return iframe;

	if (codeforcesBody) {
		const wrapper = document.createElement("div");
		wrapper.id = "codeforces-body-wrapper";
		wrapper.style.width = "100%";
		wrapper.style.height = "100%";
		wrapper.style.display = "flex";
		wrapper.style.position = "relative";

		codeforcesBody.parentNode?.insertBefore(wrapper, codeforcesBody);
		wrapper.appendChild(codeforcesBody);
	}

	// Get saved width
	const savedWidth = getSavedWidth();

	// Create iframe container with resize handle
	const iframeContainer = document.createElement("div");
	iframeContainer.style.cssText = `
    display: none;
    flex-direction: column;
    width: ${savedWidth}%;
    height: 100dvh;
    position: sticky;
    top: 0;
    background: white;
    min-width: 300px;
    max-width: 80%;
  `;

	// Create resize handle
	resizeHandle = document.createElement("div");
	resizeHandle.style.cssText = `
    width: 4px;
    height: 100%;
    background: #ccc;
    cursor: ew-resize;
    position: absolute;
    left: -2px;
    top: 0;
    z-index: 1000;
    transition: background-color 0.2s;
  `;

	// Create invisible overlay to capture mouse events during resize
	resizeOverlay = document.createElement("div");
	resizeOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    cursor: ew-resize;
    display: none;
    pointer-events: none;
  `;

	resizeHandle.addEventListener("mouseenter", () => {
		resizeHandle!.style.background = "#999";
	});

	resizeHandle.addEventListener("mouseleave", () => {
		resizeHandle!.style.background = "#ccc";
	});

	// Create the actual iframe
	const iframeElement = new DOMParser().parseFromString(
		`<iframe class="crx-iframe ${name}" src="${src}" title="${name}" sandbox="allow-scripts allow-same-origin" style="width: 100%; height: 100%; border: none; background: white;"></iframe>`,
		"text/html",
	).body.firstElementChild as HTMLElement;

	iframeContainer.appendChild(resizeHandle);
	iframeContainer.appendChild(iframeElement);

	iframe = iframeContainer;

	if (iframe && codeforcesBody) {
		codeforcesBody.parentNode?.appendChild(iframe);
		document.body.appendChild(resizeOverlay);
		setupResizeHandling();

		// Apply saved width to main content
		const remainingWidth = 100 - savedWidth;
		codeforcesBody.style.width = `${remainingWidth}%`;
		codeforcesBody.style.flexShrink = "0";
	}

	return iframe;
}

function setupResizeHandling() {
	if (!resizeHandle || !iframe || !codeforcesBody || !resizeOverlay) return;

	let isResizing = false;
	let startX = 0;
	let startWidth = 0;

	resizeHandle.addEventListener("mousedown", (e) => {
		isResizing = true;
		startX = e.clientX;
		startWidth = iframe!.offsetWidth;

		// Show overlay to capture mouse events
		resizeOverlay!.style.display = "block";
		resizeOverlay!.style.pointerEvents = "all";

		document.body.style.cursor = "ew-resize";
		document.body.style.userSelect = "none";

		e.preventDefault();
	});

	// Handle mouse move on both document and overlay
	const handleMouseMove = (e: MouseEvent) => {
		if (!isResizing) return;

		const deltaX = startX - e.clientX;
		const newWidth = Math.max(
			300,
			Math.min(window.innerWidth * 0.8, startWidth + deltaX),
		);
		const widthPercentage = (newWidth / window.innerWidth) * 100;

		iframe!.style.width = `${widthPercentage}%`;

		// Adjust the main content width
		const remainingWidth = 100 - widthPercentage;
		codeforcesBody!.style.width = `${remainingWidth}%`;
		codeforcesBody!.style.flexShrink = "0";

		// Save width in real-time (you might want to debounce this for performance)
		setTimeout(() => {
			saveWidth(widthPercentage);
		}, 100);
	};

	const handleMouseUp = () => {
		if (isResizing) {
			isResizing = false;

			// Hide overlay
			resizeOverlay!.style.display = "none";
			resizeOverlay!.style.pointerEvents = "none";

			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		}
	};

	document.addEventListener("mousemove", handleMouseMove);
	resizeOverlay.addEventListener("mousemove", handleMouseMove);

	document.addEventListener("mouseup", handleMouseUp);
	resizeOverlay.addEventListener("mouseup", handleMouseUp);

	// Handle mouse leave events to ensure cleanup
	document.addEventListener("mouseleave", handleMouseUp);
}

createIframe();

const attachFileToInput = (file: File) => {
	const fileInput = document.querySelector(
		"#sidebar form input[type=file]",
	) as HTMLInputElement;

	if (!fileInput) {
		console.error("Input element not found");
		return;
	}

	const dataTransfer = new DataTransfer();
	dataTransfer.items.add(file);
	fileInput.files = dataTransfer.files;

	fileInput.dispatchEvent(new Event("change", { bubbles: true }));
};

const exportSnippets = (file: File) => {
	const link = document.createElement("a");
	link.href = URL.createObjectURL(file);
	link.download = "xodeforces-snippets.json";
	link.click();
};

self.addEventListener("message", (event) => {
	if (event.data.type === "attachFileToInput") {
		attachFileToInput(event.data.file);
	}
	if (event.data.type === "exportSnippets") {
		exportSnippets(event.data.file);
	}
});

self.onerror = (message, source, lineno, colno, error) => {
	console.info("Error: " + message);
	console.info("Source: " + source);
	console.info("Line: " + lineno);
	console.info("Column: " + colno);
	console.info("Error object: " + error);
};
