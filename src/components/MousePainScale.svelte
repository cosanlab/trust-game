<script>
  // Component that draws a rating scale and synchronized pain duration bar to the
  // screen
  import { globalVars, calcPropSpent, round2 } from "../utils.js";

  // INPUTS:
  export let disabled = false;
  export let questionText;
  export let questionType = "other";
  export let rating;
  export let agency;
  export let endowment;
  export let cost;

  // Internal variables
  let hideThumb = true;
  let start, end, length;
  let active = false;

  $: agencyText = questionType === "other" ? "They" : "You";
  $: agencyEndowment = Math.round(agency * endowment);

  let painDur, propSpent, painBarWidth;
  // For the painbar UI, what % containing div do we want to draw the vertical bar of 5s
  // of minimum pain and the 5s label below
  let lowerBoundOffset = `${Math.round(
    (globalVars.minPainDur / globalVars.maxPainDur) * 100
  )}%`;

  $: {
    const { proportionOfEndowmentSpent } = calcPropSpent(rating, endowment);
    propSpent = proportionOfEndowmentSpent;
  }

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
      agencyEndowment,
      Math.max(0, (1 - (end - ev.clientX) / length) * agencyEndowment)
    );
    // Round to the nearest 100th decimal place
    rating = round2(rating);
    if (import.meta.env.DEV) {
      console.log(rating);
    }
  };

  const getBoundingBox = (node) => {
    const rect = node.getBoundingClientRect();
    start = rect.left;
    end = rect.right;
    length = end - start;
  };
  // OUTPUTS:
  // When using this component use bind:rating={someVariable} to get access to the
  // rating value
  // You can also optionally listen for on:change={someFunction} to run someFunction
  // each time the user changes their rating
  // To properly calculate their rating, we need to know the coordinates of the rating
  // scale *after* it gets drawn to the screen. So calculate that here
</script>

{#if agency == 0}
  <div class="flex flex-col px-2 justify-items-center">
    <h2 class="mb-4 text-2xl">{questionText}</h2>
    <p class="text-xl">
      {agencyText} were not able to spend any money from ${endowment}
    </p>
    <p class="mb-2 text-lg italic">0% deciding power</p>
  </div>
{:else}
  <!-- Money scale -->
  <div
    class="flex flex-col px-2 justify-items-center"
    on:mousemove={mouseMove}
    on:mouseenter={mouseEnter}
    on:mouseleave={mouseLeave}
    use:getBoundingBox
  >
    <h2 class="mb-4 text-2xl">{questionText}</h2>
    <label for="ratingScale" class="mb-2 text-xl"
      >{agencyText} were able to spend a maximum of ${agencyEndowment} of ${endowment}</label
    >
    <p class="mb-2 text-lg italic">
      {Math.round(agency * 100)}% deciding power
    </p>
    <input
      id="ratingScale"
      name="ratingScale"
      class="w-full h-2 bg-black outline-none appearance-none slider"
      class:active
      class:hideThumb
      class:inactive={!active}
      type="range"
      step=".01"
      min="0"
      max={agencyEndowment}
      bind:value={rating}
      {disabled}
      on:change
    />
    <div class="flex flex-row justify-between">
      <p>$0</p>
      <p>${agencyEndowment}</p>
    </div>
  </div>

  <!-- Pain Duration display -->
  <div class="flex flex-col px-2 justify-items-center">
    <label for="painDuration" class="text-xl">Pain Duration: {painDur}s</label>
    <div
      class="relative flex items-center w-full h-6 border-2 border-black border-solid justify-items-start"
    >
      <div
        class="absolute w-1 h-6 bg-black"
        style:margin-left={lowerBoundOffset}
      />
      <input
        type="range"
        id="painDuration"
        name="painDuration"
        style:width={painBarWidth}
        class="h-4 bg-yellow-300 border-none outline-none appearance-none"
        min="0"
        max={globalVars.maxPainDur}
      />
    </div>
    <div class="relative flex flex-row justify-between">
      <p>0s</p>
      <p class="absolute" style:margin-left={lowerBoundOffset}>5s</p>
      <p>{globalVars.maxPainDur}s</p>
    </div>
    <div class="mt-[-1em] mb-4">
      <p class="text-xl">Cost: {globalVars.costConversion[cost]}x</p>
    </div>
  </div>
{/if}

<style>
  #ratingScale::-webkit-slider-thumb {
    @apply appearance-none h-6 w-6 border-black border rounded-full border-solid;
  }
  #painDuration::-webkit-slider-thumb {
    @apply appearance-none;
  }
  .active::-webkit-slider-thumb {
    @apply bg-green-400;
  }
  .inactive::-webkit-slider-thumb {
    @apply bg-yellow-400;
  }
  .hideThumb::-webkit-slider-thumb {
    @apply invisible;
  }
</style>
