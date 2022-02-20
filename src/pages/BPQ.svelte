<script>
  import { createEventDispatcher } from "svelte";
  import { userStore, groupStore, saveData } from "../utils.js";
  import Loading from "../components/Loading.svelte";
  import PainScale from "../components/PainScale.svelte";

  const dispatch = createEventDispatcher();
  let submitted = false;

  // TODO: Change me to real data
  // dummy data
  let agency = 0.5; // .1 - 1
  let endowment = 20; // the shared endowment
  let multiplier = 1; // cost
  let questionText = "How much did you expect your partner to spend?";
  let q1Rating = 0.5 * (agency * endowment); // initialize to mid-point of scale

  // TODO: put the right data into the trial field in the db
  async function goToThermode_Placement() {
    submitted = true;
    // Simulate some rating each person makes when they press the button and save it to
    // the db just for development purposes
    const data = {};
    let key, val;
    if ($userStore.role === "decider1") {
      key = "D1_dummy_data";
    } else if ($userStore.role === "decider2") {
      key = "D2_dummy_data";
    } else {
      key = "R_dummy_data";
    }
    // This is the value from the rating scale in terms of raw $
    data[key] = q1Rating;
    await saveData($groupStore.groupId, data);
    dispatch("to-thermode_placement");
  }
</script>

{#if submitted}
  <Loading text={"Waiting for other participants..."} />
{:else}
  <div class="text-center">
    {#if $userStore.role === "decider1" || $userStore.role === "decider2"}
      <PainScale
        bind:rating={q1Rating}
        {endowment}
        {multiplier}
        {agency}
        {questionText}
      />
    {:else}
      <PainScale
        bind:rating={q1Rating}
        {endowment}
        {multiplier}
        {agency}
        {questionText}
      />
    {/if}

    <!-- TODO change to group progression instead of button-->

    <button
      on:click={goToThermode_Placement}
      class="px-4 py-4 mt-4 text-white rounded-full bg-violet-500 focus:outline-none hover:cursor-pointer"
    >
      Next
    </button>
  </div>
{/if}
