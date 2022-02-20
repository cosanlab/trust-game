<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { updateUser, userStore } from "../utils.js";

  const dispatch = createEventDispatcher();

  // TODO: Pain duration should be read from db
  export let painDur = 5000;

  function goToPost_Questions() {
    dispatch("to-post_questions");
  }

  if ($userStore.role === "receiver") {
    onMount(() => {
      setTimeout(goToPost_Questions, painDur);
    });
  }
</script>

<div class="flex h-screen text-center">
  <div class="m-auto">
    <h1 class="mb-4 text-2xl">Stimulation is now being delivered</h1>
  </div>
</div>
