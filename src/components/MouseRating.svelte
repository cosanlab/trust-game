<script>
  // Just like Rating.svelte, but syncs the slider position with the mouse, so it
  // doesn't require a user to click and/or drag
  import { globalVars, calcPainDuration } from "../utils.js";
  import { onMount } from "svelte";

  // INPUTS:
  export let questionText = "Question text here";
  export let rating = 50;
  export let logging = true;
  export let disabled = false;
  export let labelText = "";
  export let leftText = "Not at all";
  export let rightText = "Extremely";
  export let step = ".01";
  export let min = "1";
  export let max = "100";

  // Internal variables
  let hideThumb = true;
  let start, end, length;
  let active = false;

  // Hide the thumb by default and only reveal it the first time a user mouses over the
  // rating scale. Also change the color to green
  const mouseEnter = (ev) => {
    active = true;
    hideThumb = false;
  };

  // When they move their mouse off the element, change the color to blue
  const mouseLeave = (ev) => {
    active = false;
  };

  // When the move their mouse while over the element, calculate their rating
  const mouseMove = (ev) => {
    rating = Math.min(
      parseInt(max),
      Math.max(
        parseInt(min),
        parseInt((1 - (end - ev.clientX) / length) * parseInt(max))
      )
    );
    if (logging) {
      console.log(rating);
    }
  };

  // To properly calculate their rating, we need to know the coordinates of the rating
  // scale *after* it gets drawn to the screen. So calculate that here
  onMount(() => {
    const rect = document.getElementById("ratingScale").getBoundingClientRect();
    start = rect.left;
    end = rect.right;
    length = end - start;
  });
</script>

<style>
  #ratingScale::-webkit-slider-thumb {
    @apply appearance-none h-6 w-6 border-black border rounded-full border-solid;
  }
  .active::-webkit-slider-thumb {
    @apply bg-green-400;
  }
  .inactive::-webkit-slider-thumb {
    @apply bg-blue-400;
  }
  .hideThumb::-webkit-slider-thumb {
    @apply invisible;
  }
</style>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
  class="flex flex-col px-2 justify-items-center"
  on:mousemove={mouseMove}
  on:mouseenter={mouseEnter}
  on:mouseleave={mouseLeave}
>
  <h2 class="mb-2 text-2xl">{questionText}</h2>
  <label for="ratingScale" class="mb-2 text-xl">{labelText}</label>
  <input
    id="ratingScale"
    name="ratingScale"
    class="w-full h-2 bg-black outline-none appearance-none slider"
    class:active
    class:hideThumb
    class:inactive={!active}
    type="range"
    {step}
    {min}
    {max}
    {disabled}
    bind:value={rating}
    on:change
  />
  <div class="flex flex-row justify-between">
    <p>{leftText}</p>
    <p>{rightText}</p>
  </div>
</div>
