<script>
  // Component that draws a rating scale and synchronized pain duration bar to the
  // screen
  import { globalVars, calcPropSpent, round2, groupStore } from "../utils.js";

  // INPUTS:
  export let visibleParams;
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

<div class="flex flex-col px-2 justify-items-center">
  {#if visibleParams}
    <p class="mb-2 text-lg">Shared endowment: ${endowment}</p>
    <p class="mb-2 text-lg">Multiplier: {globalVars.multiplier}</p>
  {/if}
  <h2 class="my-4 text-2xl">{questionText}</h2>
</div>

<!-- Money scale -->
<div class="flex flex-col px-2 justify-items-center">
  <div class="box">
    <!-- {#if $groupStore.currentState === "phase-01"} -->
    <h2 class="my-4 text-2xl">${round2(propSpent * endowment)}</h2>
    <!-- {/if} -->
  </div>

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
  <!-- <div class="flex flex-row justify-between">
    <p>{whoText} would keep: ${round2(endowment - propSpent * endowment)}</p>
    <p>{whoText} would give: ${round2(propSpent * endowment)}</p>
  </div> -->
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
  .box {
    padding: 2%;
    background-color: rgba(255, 255, 255, 0.4);
    border: 2px solid grey;
    border-radius: 2px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  }
</style>
