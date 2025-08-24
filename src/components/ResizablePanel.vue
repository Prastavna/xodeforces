<template>
  <div ref="container" :class="containerClass">
    <div ref="topPanel" :style="{ height: topHeight }" class="overflow-hidden">
      <slot name="top" />
    </div>
    
    <div 
      ref="resizer"
      :class="resizerClass"
      @mousedown="startResize"
    >
      <div class="w-full h-0.5 bg-gray-300 group-hover:bg-blue-500 transition-colors"></div>
    </div>
    
    <div ref="bottomPanel" :style="{ height: bottomHeight }" class="overflow-hidden">
      <div class="h-full flex">
        <div ref="leftPanel" :style="{ width: leftWidth }" class="overflow-hidden">
          <slot name="bottom-left" />
        </div>
        
        <div 
          ref="verticalResizer"
          class="w-1 bg-gray-200 hover:bg-blue-500 cursor-col-resize transition-colors flex items-center justify-center group"
          @mousedown="startVerticalResize"
        >
          <div class="w-0.5 h-8 bg-gray-400 group-hover:bg-blue-600 transition-colors"></div>
        </div>
        
        <div ref="rightPanel" :style="{ width: rightWidth }" class="overflow-hidden">
          <slot name="bottom-right" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { storage } from "../services/storage";

interface Props {
	storageKey?: string;
	minTopHeight?: number;
	minBottomHeight?: number;
	minLeftWidth?: number;
	minRightWidth?: number;
	defaultTopHeight?: string;
	defaultLeftWidth?: string;
}

const props = withDefaults(defineProps<Props>(), {
	storageKey: "resizable-panel-sizes",
	minTopHeight: 200,
	minBottomHeight: 150,
	minLeftWidth: 200,
	minRightWidth: 200,
	defaultTopHeight: "60%",
	defaultLeftWidth: "50%",
});

const container = ref<HTMLElement>();
const topPanel = ref<HTMLElement>();
const bottomPanel = ref<HTMLElement>();
const leftPanel = ref<HTMLElement>();
const rightPanel = ref<HTMLElement>();
const resizer = ref<HTMLElement>();
const verticalResizer = ref<HTMLElement>();

const topHeight = ref(props.defaultTopHeight);
const leftWidth = ref(props.defaultLeftWidth);
const isResizing = ref(false);
const isVerticalResizing = ref(false);

const containerClass = computed(() => [
	"h-full flex flex-col",
	{
		"select-none": isResizing.value || isVerticalResizing.value,
	},
]);

const resizerClass = computed(() => [
	"h-2 bg-gray-100 hover:bg-blue-100 cursor-row-resize transition-colors flex items-center justify-center group",
	{
		"bg-blue-100": isResizing.value,
	},
]);

const bottomHeight = computed(() => {
	if (typeof topHeight.value === "string" && topHeight.value.includes("%")) {
		const percent = parseFloat(topHeight.value);
		return `${100 - percent}%`;
	}
	return `calc(100% - ${topHeight.value})`;
});

const rightWidth = computed(() => {
	if (typeof leftWidth.value === "string" && leftWidth.value.includes("%")) {
		const percent = parseFloat(leftWidth.value);
		return `${100 - percent}%`;
	}
	return `calc(100% - ${leftWidth.value})`;
});

const loadSizes = () => {
	try {
		const saved = storage.local.get(props.storageKey);
		if (saved) {
			const { topHeight: savedTop, leftWidth: savedLeft } = JSON.parse(saved);
			if (savedTop) topHeight.value = savedTop;
			if (savedLeft) leftWidth.value = savedLeft;
		}
	} catch (error) {
		console.warn("Failed to load panel sizes:", error);
	}
};

const saveSizes = () => {
	try {
		storage.local.set(
			props.storageKey,
			JSON.stringify({
				topHeight: topHeight.value,
				leftWidth: leftWidth.value,
			}),
		);
	} catch (error) {
		console.warn("Failed to save panel sizes:", error);
	}
};

const startResize = (e: MouseEvent) => {
	if (!container.value) return;

	isResizing.value = true;
	const startY = e.clientY;
	const containerRect = container.value.getBoundingClientRect();
	const startTopHeight = topPanel.value?.offsetHeight || 0;

	const onMouseMove = (e: MouseEvent) => {
		const deltaY = e.clientY - startY;
		const newTopHeight = Math.max(
			props.minTopHeight,
			Math.min(
				containerRect.height - props.minBottomHeight,
				startTopHeight + deltaY,
			),
		);

		const percentage = (newTopHeight / containerRect.height) * 100;
		topHeight.value = `${percentage}%`;
	};

	const onMouseUp = () => {
		isResizing.value = false;
		saveSizes();
		document.removeEventListener("mousemove", onMouseMove);
		document.removeEventListener("mouseup", onMouseUp);
	};

	document.addEventListener("mousemove", onMouseMove);
	document.addEventListener("mouseup", onMouseUp);
};

const startVerticalResize = (e: MouseEvent) => {
	if (!bottomPanel.value) return;

	isVerticalResizing.value = true;
	const startX = e.clientX;
	const containerRect = bottomPanel.value.getBoundingClientRect();
	const startLeftWidth = leftPanel.value?.offsetWidth || 0;

	const onMouseMove = (e: MouseEvent) => {
		const deltaX = e.clientX - startX;
		const newLeftWidth = Math.max(
			props.minLeftWidth,
			Math.min(
				containerRect.width - props.minRightWidth,
				startLeftWidth + deltaX,
			),
		);

		const percentage = (newLeftWidth / containerRect.width) * 100;
		leftWidth.value = `${percentage}%`;
	};

	const onMouseUp = () => {
		isVerticalResizing.value = false;
		saveSizes();
		document.removeEventListener("mousemove", onMouseMove);
		document.removeEventListener("mouseup", onMouseUp);
	};

	document.addEventListener("mousemove", onMouseMove);
	document.addEventListener("mouseup", onMouseUp);
};

onMounted(() => {
	loadSizes();
});

onUnmounted(() => {
	document.removeEventListener("mousemove", () => {});
	document.removeEventListener("mouseup", () => {});
});
</script>