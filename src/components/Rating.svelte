<script>
  // Component that draws a rating scale and synchronized pain duration bar to the
  // screen
  import { globalVars, calcPropSpent } from "../utils.js";

  // INPUTS:
  export let questionText;
  export let rating;
  export let disabled = false;
  export let labelText = "";
  export let leftText = "Not at all";
  export let rightText = "Extremely";
  export let step = ".01";
  export let min = "1";
  export let max = "100";

  // OUTPUTS:
  // When using this component use bind:rating={someVariable} to get access to the
  // rating value
  // You can also optionally listen for on:change={someFunction} to run someFunction
  // each time the user changes their rating
</script>

<div class="flex flex-col px-2 justify-items-center">
  <h2 class="mb-2 text-2xl">{questionText}</h2>
  <label for="ratingScale" class="mb-2 text-xl">{labelText}</label>
  <input
    id="ratingScale"
    name="ratingScale"
    class="w-full h-2 bg-black outline-none appearance-none slider"
    type="range"
    {step}
    {min}
    {max}
    bind:value={rating}
    {disabled}
    on:change
  />
  <div class="flex flex-row justify-between">
    <p>{leftText}</p>
    <p>{rightText}</p>
  </div>
</div>

<style>
  #ratingScale::-webkit-slider-thumb {
    @apply appearance-none h-6 w-6 border-black border rounded-full bg-blue-400 border-solid;
  }
</style>
