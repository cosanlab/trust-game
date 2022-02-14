<script>
  import { createEventDispatcher } from "svelte";
  import { updateUser, userStore } from "../utils.js";

  const dispatch = createEventDispatcher();

  function goToDebrief() {
    dispatch("to-debrief");
  }
</script>

<div class="text-center">
  {#if $userStore.role === "decider"}
    <h1 class="mb-4 text-2xl">Question #1</h1>
    <h4 class="mb-4 text-2xl">How guilty did you feel?</h4>
    <h2 class="mb-4 text-2xl">Display trial info here</h2>
    <h3 class="mb-4 text-2xl">Display Sliding Scale here</h3>
  {:else}
    <h1 class="mb-4 text-2xl">Question #1</h1>
    <h4 class="mb-4 text-2xl">How satisfied do you feel?</h4>
    <h2 class="mb-4 text-2xl">Display trial info here</h2>
    <h3 class="mb-4 text-2xl">Display Sliding Scale here</h3>
  {/if}

  <!-- TODO change to group progression instead of button-->
  <button
    on:click={goToDebrief}
    class="px-4 py-4 text-white rounded-full bg-violet-500 focus:outline-none hover:cursor-pointer"
  >
    Next
  </button>
</div>
