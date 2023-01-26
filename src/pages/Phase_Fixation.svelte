<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { groupStore } from "../utils";

  const ITI = $groupStore.trials[$groupStore.currentTrial].ITI * 1000;
  const dispatch = createEventDispatcher();
  onMount(() => {
    console.log(`waiting for ITI ${ITI}`);
    setTimeout(() => {
      dispatch("get-next-trial");
    }, ITI);
  });
</script>

<div class="flex items-center justify-center h-screen mx-auto">
  <h1 class="text-[15rem] text-center">+</h1>
</div>
