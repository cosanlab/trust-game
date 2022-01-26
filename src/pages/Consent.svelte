<script>
  import { createEventDispatcher } from "svelte";
  import { updateUser } from "../utils.js";

  const dispatch = createEventDispatcher();

  function goToExperiment() {
    dispatch("to-experiment");
  }
</script>

<div class="text-center">
  <h1 class="mb-4 text-2xl">This is my consent page</h1>
  <button
    on:click={goToExperiment}
    class="px-4 py-4 text-white rounded-full bg-violet-500 focus:outline-none hover:cursor-pointer">
    Go to experiment
  </button>
</div>
