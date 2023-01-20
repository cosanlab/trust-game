<script>
  // Component that draws a rating scale and synchronized pain duration bar to the
  // screen
  import { globalVars, calcPropSpent, round2 } from "../utils.js";

  // INPUTS:
  export let disabled = false;
  export let questionText;
  export let questionType = "other";
  export let rating;
  export let endowment;

  $: agencyText = questionType === "other" ? "They" : "You";
  $: agencyEndowment = endowment;

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
  <p class="mb-2 text-lg">Shared endowment: ${endowment}</p>
  <h2 class="my-4 text-2xl">{questionText}</h2>
</div>
<!-- Money scale -->
<div class="flex flex-col px-2 justify-items-center">
  <label for="ratingScale" class="mb-2 text-xl"
    >{agencyText} would keep: ${round2(
      agencyEndowment - propSpent * agencyEndowment
    )}</label
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
    max={agencyEndowment}
    bind:value={rating}
    {disabled}
    on:change
  />
  <div class="flex flex-row justify-between">
    <p>$0</p>
    <p>${agencyEndowment} of ${endowment}</p>
  </div>
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
