<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { userStore, groupStore, globalVars, roundHalf } from "../utils.js";

  const dispatch = createEventDispatcher();

  const painDur =
    roundHalf($groupStore.trials[$groupStore.currentTrial].pain_dur) * 1000 +
    globalVars.deliveryTimeBuffer;

  function goToPost_Questions() {
    dispatch("to-phase-04");
  }
</script>

<div class="flex h-screen text-center">
  <div class="m-auto">
    <h1 class="mb-4 text-2xl">Stimulation is now being delivered</h1>
  </div>
</div>
