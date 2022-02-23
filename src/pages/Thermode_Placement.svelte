<script>
  import { createEventDispatcher } from "svelte";
  import { userStore } from "../utils.js";
  import Loading from "../components/Loading.svelte";
  import Button from "../components/Button.svelte";

  // TODO: We need to randomize site across trials, but this will happen in the upload
  // script to replace this with a read from the database
  export let site = 1;

  const dispatch = createEventDispatcher();

  function goToDelivery() {
    dispatch("to-delivery");
  }
</script>

<div class="flex h-screen text-center">
  <div class="m-auto">
    {#if $userStore.role === "receiver"}
      <h1 class="mb-4 text-2xl">
        Experimenter please place the thermode on site {site}
      </h1>
      <Button on:click={goToDelivery}>Ready</Button>
    {:else}
      <h1 class="mb-4 text-2xl">Waiting for experimenter to place thermode</h1>
    {/if}
  </div>
</div>
