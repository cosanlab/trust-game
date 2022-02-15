<script>
  import { createEventDispatcher } from "svelte";
  import { updateUser, userStore } from "../utils.js";

  const dispatch = createEventDispatcher();

  function goToPost_Questions() {
    dispatch("to-post_questions");
  }
</script>

<div>
  <button
    on:click={goToPost_Questions}
    class="px-4 py-4 text-white rounded-full bg-violet-500 focus:outline-none hover:cursor-pointer"
  >
    Next
  </button>
</div>
