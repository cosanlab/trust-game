<script>
  // Component that draws a rating scale and synchronized pain duration bar to the
  // screen
  import { globalVars, calcPainDuration, round2 } from "../utils.js";

  // INPUTS:
  export let disabled = false;
  export let questionText;
  export let questionType = "other";
  export let rating;
  export let agency;
  export let endowment;
  export let cost;

  $: agencyText = questionType === "other" ? "They" : "You";
  $: agencyEndowment = agency * endowment;

  let painDur, propSpent, painBarWidth;
  // For the painbar UI, what % containing div do we want to draw the vertical bar of 5s
  // of minimum pain and the 5s label below
  let lowerBoundOffset = `${Math.round(
    (globalVars.minPainDur / globalVars.maxPainDur) * 100
  )}%`;

  $: {
    const { painDurationRounded, proportionOfEndowmentSpent } =
      calcPainDuration(rating, cost, agencyEndowment);
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

<style>
  #ratingScale::-webkit-slider-thumb {
    @apply appearance-none h-6 w-6 rounded-full border-solid;
  }
  #painDuration::-webkit-slider-thumb {
    @apply appearance-none;
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
  .enabled-bar {
    @apply bg-yellow-300;
  }
  .disabled-bar {
    @apply bg-yellow-400;
  }
</style>

<div class="flex flex-col px-2 justify-items-center">
  <p class="mb-2 text-lg">Shared endowment: ${endowment}</p>
  <p class="mb-2 text-lg">
    {agencyText} were responsible for: {Math.round(agency * 100)}%
  </p>
  <p class="mb-2 text-lg">
    Cost of reducing pain: {globalVars.costConversion[cost]}x
  </p>
  <h2 class="my-4 text-2xl">{questionText}</h2>
</div>
{#if agency == 0}
  <p class="mb-2 text-xl italic">
    {agencyText} were not responsible for any money
  </p>
{:else}
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

  <!-- Pain Duration display -->
  <div class="flex flex-col px-2 justify-items-center">
    <label for="painDuration" class="text-xl">Pain Duration: {painDur}s</label>
    <div
      class="relative flex items-center w-full h-6 border-2 border-solid justify-items-start"
      class:border-black={!disabled}
      class:border-gray-500={disabled}
    >
      <div
        class="absolute w-1 h-6 bg-black"
        style:margin-left={lowerBoundOffset}
      />
      <input
        type="range"
        id="painDuration"
        name="painDuration"
        class:disabled-bar={disabled}
        class:enabled-bar={!disabled}
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
  </div>
{/if}
