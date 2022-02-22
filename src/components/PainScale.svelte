<script>
  // Component that draws a rating scale and synchronized pain duration bar to the
  // screen
  import { globalVars, calcPainDuration } from "../utils.js";

  // INPUTS:
  export let disabled = false;
  export let questionText;
  export let rating;
  export let agency;
  export let endowment;
  export let multiplier;

  let painDur, propSpent, painBarWidth;
  let agencyEndowment = Math.round(agency * endowment);
  // For the painbar UI, what % containing div do we want to draw the vertical bar of 5s
  // of minimum pain and the 5s label below
  let lowerBoundOffset = `${Math.round(
    (globalVars.minPainDur / globalVars.maxPainDur) * 100
  )}%`;

  $: {
    const { painDurationRounded, proportionOfEndowmentSpent } =
      calcPainDuration(rating, multiplier, endowment);
    painDur = painDurationRounded;
    propSpent = proportionOfEndowmentSpent;
    painBarWidth = `${(painDur / globalVars.maxPainDur) * 100}%`;
  }

  // OUTPUTS:
  // When using this component use bind:rating={someVariable} to get access to the
  // rating value
  // You can also optionally listen for on:change={someFunction} to run someFunction
  // each time the user changes their rating
</script>

<!-- Money scale -->
<div class="flex flex-col px-2 justify-items-center">
  <h2 class="mb-4 text-2xl">{questionText}</h2>
  <label for="ratingScale" class="mb-2 text-xl"
    >They were able to spend a maximum of ${agencyEndowment} of ${endowment}</label
  >
  <input
    id="ratingScale"
    name="ratingScale"
    class="w-full h-2 bg-black outline-none appearance-none slider"
    type="range"
    step=".1"
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
  <div class="mt-[-1em]">
    <br /> <br />
    <p class="text-xl">Mutiplier: {multiplier}x</p>
  </div>
</div>

<style>
  #ratingScale::-webkit-slider-thumb {
    @apply appearance-none h-6 w-6 border-black border rounded-full bg-yellow-300 border-solid;
  }
  #painDuration::-webkit-slider-thumb {
    @apply appearance-none;
  }
</style>
