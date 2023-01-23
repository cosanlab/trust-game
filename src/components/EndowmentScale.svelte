<script>
  // Component that draws a rating scale and synchronized pain duration bar to the
  // screen
  import { globalVars, calcPropSpent, round2, groupStore } from "../utils.js";

  // INPUTS:
  export let disabled = false;
  export let questionText;
  export let questionType = "other";
  export let rating;
  export let endowment;

  $: whoText = questionType === "other" ? "They" : "You";
  $: otherText = questionType === "other" ? "You" : "They";
  $: endowmentAmount = endowment;

  let multiplier = globalVars.multiplier;

  let propSpent;
  $: {
    const { proportionOfEndowmentSpent } = calcPropSpent(rating, endowment);
    propSpent = proportionOfEndowmentSpent;
  }
  // OUTPUTS:
  // When using this component use bind:rating={someVariable} to get access to the
  // rating value
  // You can also optionally listen for on:change={someFunction} to run someFunction
  // each time the user changes their rating
</script>

<!-- TODO: have the below be a prop to toggle visibility -->
<div class="flex flex-col px-2 justify-items-center">
  <p class="mb-2 text-lg">Shared endowment: ${endowment}</p>
  <p class="mb-2 text-lg">Multiplier: {globalVars.multiplier}</p>
  <h2 class="my-4 text-2xl">{questionText}</h2>
</div>
<!-- TODO: simplify text:
remove 'you/they would keep' and 'they/you would give' labels 
above and below scale and instead put that info in the anchors of the scale itself -->
<!-- Money scale -->
<div class="flex flex-col px-2 justify-items-center">
  <label for="ratingScale" class="mb-2 text-xl"
    >{whoText} would keep: ${round2(endowment - propSpent * endowment)}</label
  >
  <input
    id="ratingScale"
    name="ratingScale"
    class="w-full h-2 bg-black outline-none appearance-none slider"
    class:disabled
    class:enabled={!disabled}
    type="range"
    step=".01"
    min="0"
    max={endowment}
    bind:value={rating}
    {disabled}
    on:change
  />
  <div class="flex flex-row justify-between">
    <p>$0</p>
    <p>${endowment} of ${endowment}</p>
  </div>
  <label for="ratingScale" class="mb-2 text-xl"
    >{whoText} would give: ${round2(propSpent * endowment)}</label
  >
  <!-- TODO: make this adjustable dynamically based on role as well
  e.g. 'they will receive' for investor and 'you would receive' for trustee -->
  {#if $groupStore.currentState === "phase-01"}
    <label for="ratingScale" class="mb-2 text-xl"
      >You could receive up to ${round2(propSpent * endowment * multiplier)} after
      the multiplier is applied</label
    >
  {/if}
</div>

<style>
  #ratingScale::-webkit-slider-thumb {
    @apply appearance-none h-6 w-6 rounded-full border-solid;
  }
  .enabled {
    @apply bg-black border;
  }
  .enabled::-webkit-slider-thumb {
    @apply bg-yellow-300 border-black;
  }
  .disabled {
    @apply bg-gray-500;
  }
  .disabled::-webkit-slider-thumb {
    @apply bg-yellow-500 border-gray-500 border-2;
  }
</style>
