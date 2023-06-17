
export let data = [
  {
    id: 1,
    title: "some long name of the File 1",
    type: "javascript",
    content: ` 
  import { onMount, onDestroy } from "svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  let containerWidth = 300; // Initial width of the resizable container

  let isDragging = false;
  let startX = 0;
  let startWidth = 0;

  let resizableContainer;

  function handleMouseDown(event) {
    // Check if the mouse is near the right edge of the container
    const isNearRightEdge =
      event.clientX >= resizableContainer.getBoundingClientRect().right - 10;
    if (!isNearRightEdge) {
      return;
    }

    isDragging = true;
    startX = event.clientX;
    startWidth = resizableContainer.offsetWidth;
  }

  function handleMouseMove(event) {
    if (!isDragging) {
      // Check if the mouse is hovering over the right edge of the container
      const isHoveringRightEdge =
        event.clientX >= resizableContainer.getBoundingClientRect().right - 5;
      resizableContainer.style.cursor = isHoveringRightEdge
        ? "col-resize"
        : "default";
      return;
    }

    const dx = event.clientX - startX;
    containerWidth = Math.max(0, startWidth + dx); // Set a minimum width if needed by replacing 0
  }

  function handleMouseUp() {
    if (isDragging) {
      isDragging = false;
      dispatch("resize", containerWidth);
    }
  }

  onMount(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });
`,
    ismanaged: false,
  },
  {
    id: 2, title: "File 2", type: "javascript",
    content: "if(true){console.log(2)}",
    ismanaged: false
  },
  {
    id: 3, title: "File 3", type: "javascript",
    content: "if(true){console.log(3)}",
    ismanaged: false
  },
  {
    id: 4, title: "File 4", type: "javascript",
    content: "if(true){console.log(4)}",
    ismanaged: false
  },
  {
    id: 5, title: "File 5", type: "javascript",
    content: "if(true){console.log(5)}",
    ismanaged: false
  },
  {
    id: 6, title: "File 6", type: "javascript",
    content: "if(true){console.log(6)}",
    ismanaged: false
  },
  {
    id: 7, title: "File 7", type: "javascript",
    content: "if(true){console.log(7)}",
    ismanaged: false
  },
  {
    id: 8, title: "File 8", type: "javascript",
    content: "if(true){console.log(8)}",
    ismanaged: false
  },
  {
    id: 9, title: "File 9", type: "javascript",
    content: "if(true){console.log(9)}",
    ismanaged: false
  },
  {
    id: 10, title: "File 10", type: "html",
    content: ` 
<div
  class="resizable-container"
  style="width: {containerWidth}px; left: 0;"
  on:mousedown={handleMouseDown}
  bind:this={resizableContainer}
>
  <h2>hi</h2>
</div>

<style>
  .resizable-container {
    position: relative;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    overflow: hidden;
  }
</style>
    <body>hi</body>`,
    ismanaged: false
  },
  {
    id: 11, title: "File 11", type: "css",
    content: "p{color:blue}",
    ismanaged: false
  },
];
