<script>
  import { createEventDispatcher } from "svelte";
  import { updateUser, userId, groupStore } from "../utils.js";
  import Loading from "../components/Loading.svelte";

  let submitted = false;
  const dispatch = createEventDispatcher();

  function goToPre_Questions() {
    submitted = true;
    dispatch("to-pre_questions");
  }
</script>

{#if submitted}
  <Loading text={"Waiting for other participants..."} />
{:else}
  <div class="text-center">
    <h1 class="mb-4 text-2xl">Instructions for Part 2</h1>
    {#if import.meta.env.DEV}
      <h2 class="text-xl">
        <span class="font-bold">I am: </span>
        <span class="italic">{$userId}</span>
      </h2>
      <h2 class="text-xl">
        <span class="font-bold">My group is in state: </span>
        <span class="italic">{$groupStore.currentState}</span>
      </h2>
    {/if}
    <p>
      In part 2, a random selection of the decisions made in part 1 have been
      chosen to be enacted <br />
      and you will answer a series of questions before and after the pain stimulus
      is actually delivered. <br />
      You will rate and commit to answers using sliding scales similar to the ones
      you practiced with in Part 1 <br />
      Remember to left-click when you are ready to submit an answer and the experiment
      will progress <br />
      automatically when each subject has responded.
    </p>
    <button
      on:click={goToPre_Questions}
      class="px-4 py-4 text-white rounded-full bg-violet-500 focus:outline-none hover:cursor-pointer"
    >
      Ready
    </button>
  </div>
{/if}
