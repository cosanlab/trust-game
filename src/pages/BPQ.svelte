<script>
  import { createEventDispatcher } from "svelte";
  import { updateUser, userStore, groupStore, saveData } from "../utils.js";
  import Loading from "../components/Loading.svelte";

  const dispatch = createEventDispatcher();
  let submitted = false;

  async function goToThermode_Placement() {
    submitted = true;
    // Simulate some rating each person makes when they press the button and save it to
    // the db just for development purposes
    const data = {};
    let key, val;
    if ($userStore.role === "decider1") {
      key = "D1_dummy_data";
      val = 8;
    } else if ($userStore.role === "decider2") {
      key = "D2_dummy_data";
      val = 2;
    } else {
      key = "R_dummy_data";
      val = 7;
    }
    data[key] = val;
    await saveData($groupStore.groupId, data);
    dispatch("to-thermode_placement");
  }
</script>

{#if submitted}
  <Loading text={"Waiting for other participants..."} />
{:else}
  <div class="text-center">
    {#if $userStore.role === "decider1" || $userStore.role === "decider2"}
      <h1 class="mb-4 text-2xl">Question #1</h1>
      <h4 class="mb-4 text-2xl">
        How much did you expect your partner to spend in this trial?
      </h4>
      <h2 class="mb-4 text-2xl">
        Display trial info here (other decider's info)
      </h2>
      <h3 class="mb-4 text-2xl">Display Sliding Scale here</h3>
    {:else}
      <h1 class="mb-4 text-2xl">Question #1</h1>
      <h4 class="mb-4 text-2xl">
        How much did you expect this decider to spend in this trial?
      </h4>
      <h2 class="mb-4 text-2xl">Display trial info here</h2>
      <h3 class="mb-4 text-2xl">Display Sliding Scale here</h3>
    {/if}

    <!-- TODO change to group progression instead of button-->

    <button
      on:click={goToThermode_Placement}
      class="px-4 py-4 text-white rounded-full bg-violet-500 focus:outline-none hover:cursor-pointer"
    >
      Next
    </button>
  </div>
{/if}
