<script>
  import { createEventDispatcher } from "svelte";
  import { updateUser } from "../utils.js";

  const dispatch = createEventDispatcher();

  function goToPost_Questions() {
    dispatch("to-post_questions");
  }
</script>

<div class="text-center">
  <h1 class="mb-4 text-2xl">This is the Delivery page</h1>
  <button
    on:click={goToPost_Questions}
    class="px-4 py-4 text-white bg-green-500 rounded-full focus:outline-none hover:cursor-pointer"
  >
    Next
  </button>
</div>
