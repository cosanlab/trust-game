<script>
  import { createEventDispatcher } from "svelte";
  import { updateUser, userStore } from "../utils.js";

  const dispatch = createEventDispatcher();

  function goToDelivery() {
    dispatch("to-delivery");
  }
</script>

<div>
  <button
    on:click={goToDelivery}
    class="px-4 py-4 text-white rounded-full bg-violet-500 focus:outline-none hover:cursor-pointer"
  >
    Next
  </button>
</div>
