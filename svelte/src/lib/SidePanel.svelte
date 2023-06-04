<script>
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
</script>

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
