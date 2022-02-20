<script>
  // Component that draws a rating scale and synchronized pain duration bar to the
  // screen
  import { globalVars, calcPainDuration } from "../utils.js";

  // INPUTS:
  export let questionText;
  export let rating;
  export let labelText = "";
  export let leftText = "Not at all";
  export let rightText = "Extremely";

  // OUTPUTS:
  // When using this component use bind:rating={someVariable} to get access to the
  // rating value
  // You can also optionally listen for on:change={someFunction} to run someFunction
  // each time the user changes their rating
</script>

<style>
  #ratingScale::-webkit-slider-thumb {
    @apply appearance-none h-6 w-6 border-black border rounded-full bg-blue-400 border-solid;
  }
  #painDuration::-webkit-slider-thumb {
    @apply appearance-none;
  }
</style>

<div class="flex flex-col px-2 justify-items-center">
  <h2 class="mb-2 text-2xl">{questionText}</h2>
  <label for="ratingScale" class="mb-2 text-xl">{labelText}</label>
  <input
    id="ratingScale"
    name="ratingScale"
    class="w-full h-2 bg-black outline-none appearance-none slider"
    type="range"
    step=".1"
    min="0"
    max="100"
    bind:value={rating}
    on:change
  />
  <div class="flex flex-row justify-between">
    <p>{leftText}</p>
    <p>{rightText}</p>
  </div>
</div>
