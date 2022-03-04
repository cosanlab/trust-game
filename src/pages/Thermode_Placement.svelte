<script>
  import { createEventDispatcher } from "svelte";
  import { userStore, groupStore, roundHalf } from "../utils.js";
  import Loading from "../components/Loading.svelte";
  import Button from "../components/Button.svelte";

  let site = $groupStore.trials[$groupStore.currentTrial].site;
  let protocol = roundHalf(
    $groupStore.trials[$groupStore.currentTrial].pain_dur
  );

  const dispatch = createEventDispatcher();

  function goToDelivery() {
    dispatch("to-delivery");
  }
</script>

<div class="flex h-screen text-center">
  <div class="m-auto">
    {#if $userStore.role === "receiver"}
      <h1 class="mb-4 text-2xl">
        Experimenter please place the thermode on site {site} and use protocol {protocol}
      </h1>
      <Button on:click={goToDelivery}>Ready</Button>
    {:else}
      <h1 class="mb-4 text-2xl">Waiting for experimenter to place thermode</h1>
    {/if}
  </div>
</div>
