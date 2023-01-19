<script>
  // Just like StatusHeader.svelte, but only used during the instructions and doesn't
  // update dynamically

  const stateDisplay = [
    "Investor makes offer",
    "Expectation ratings",
    "Trustee makes return decision",
    "Trial Outcome",
  ];
</script>

<style>
  .steps {
    @apply inline-grid grid-flow-col overflow-hidden overflow-x-auto auto-cols-fr pb-2;
  }
  .step {
    @apply grid grid-cols-1 grid-rows-2 place-items-center text-center before:top-0 before:col-start-1 before:row-start-1 before:h-0 before:w-full before:transform before:content-[''] after:z-10 after:relative after:col-start-1 after:row-start-1 after:grid after:h-8 after:w-8 after:place-items-center after:place-self-center after:rounded-full after:bg-gray-400 before:ml-[-100%] first:before:content-none before:border before:border-black before:border-solid after:border after:border-gray-500;
  }

  .active {
    @apply after:bg-violet-500 before:bg-violet-500 after:border-2 after:border-black;
  }
</style>

<div class="flex">
  <ul class="steps">
    {#each stateDisplay as name}
      <li class="step">
        {name}
      </li>
    {/each}
  </ul>
</div>
