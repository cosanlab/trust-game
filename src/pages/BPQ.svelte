<script>
  import { createEventDispatcher } from "svelte";
  import { updateUser, userStore } from "../utils.js";

  const dispatch = createEventDispatcher();

  function goToDelivery() {
    dispatch("to-delivery");
  }
</script>

<div class="text-center">
  {#if $userStore.role === "decider"}
    <h1 class="mb-4 text-2xl">Question #1</h1>
    <h4 class="mb-4 text-2xl">
      How much did you expect your partner to spend in this trial?
    </h4>
    <h2 class="mb-4 text-2xl">
      Display trial info here (other decider's info)
    </h2>
    <h3 class="mb-4 text-2xl">Display Sliding Scale here</h3>
  {:else}
    <h1 class="mb-4 text-2xl">Question #1</h1>
    <h4 class="mb-4 text-2xl">
      How much did you expect this decider to spend in this trial?
    </h4>
    <h2 class="mb-4 text-2xl">Display trial info here</h2>
    <h3 class="mb-4 text-2xl">Display Sliding Scale here</h3>
  {/if}

  <!-- TODO change to group progression instead of button-->

  <button
    on:click={goToDelivery}
    class="px-4 py-4 text-white rounded-full bg-violet-500 focus:outline-none hover:cursor-pointer"
  >
    Next
  </button>
</div>
