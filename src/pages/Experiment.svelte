<script>
  import { createEventDispatcher } from "svelte";
  import { updateUser } from "../utils.js";

  const dispatch = createEventDispatcher();

  function goToDebrief() {
    dispatch("to-debrief");
  }
</script>

<div class="text-center">
  <h1 class="mb-4 text-2xl">This is the experiment page</h1>
  <button
    on:click={goToDebrief}
    class="px-4 py-4 text-white bg-green-500 rounded-full focus:outline-none hover:cursor-pointer"
  >
    Go to debrief
  </button>
</div>
