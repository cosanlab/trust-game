<script>
  // Simple header display that shows what the current group state is when we're in the
  // main trial loop
  import { groupStore } from "../utils";

  const stateDisplay = [
    { name: "phase-01", display: "Investor makes offer" },
    {
      name: "phase-02",
      display: "Expectation ratings",
    },
    { name: "phase-03", display: "Trustee makes return decision" },
    { name: "phase-04", display: "Trial Outcome" },
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

{#if $groupStore.currentState !== "instructions" && $groupStore.currentState !== "debrief"}
  <div class="flex">
    <h2
      class="inline px-4 mr-10 text-white bg-blue-500 border border-blue-700 rounded-full self-baseline"
    >
      Trial: {$groupStore.currentTrial + 1} of {$groupStore.trials.length}
    </h2>
    <ul class="steps">
      {#each stateDisplay as { name, display }}
        <li class="step" class:active={$groupStore.currentState === name}>
          {display}
        </li>
      {/each}
    </ul>
  </div>
{/if}
