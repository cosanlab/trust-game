<!-- Single outcome screen that shows how much each person made based upon the 
  previous phase in addition to the expectation outcomes. 

  Only rendering differences are:
  - the amount of money based on role
  - phase 2's expectation ratings 

  TODO: Check with Luke:
  We could also need to render rating scales, with the question wording being different:
  Trustee: how angry/satisfied
  Investor: how guilty/satisfied

  Data needed:
  - [x] Investor expectation from phase 2 -> DB
  - [x] Trustee expectation from phase 2 -> DB
  - [x] Investor earned from phase 3 -> DB
  - [x] Trustee earned from phase 3 -> DB

  Data stored/modified:
  - [x] Investor anger/satisfcation
  - [x] Trustee guilt/satisfcation
-->
<script>
  import { createEventDispatcher } from "svelte";
  import {
    userStore,
    groupStore,
    saveAPQData,
    globalVars,
    saveQData,
    round2,
    getRandomInt,
  } from "../utils.js";
  import Loading from "../components/Loading.svelte";
  import Rating from "../components/Rating.svelte";
  import Button from "../components/Button.svelte";

  const dispatch = createEventDispatcher();
  let showTrialParams = false;
  let submitted = false;

  // GET TRIAL DATA
  let currentTrial = $groupStore.currentTrial;
  let totalTrials = $groupStore.trials.length;

  // Shared endowment
  let endowment = $groupStore.trials[currentTrial].endowment;

  let I_expectation = $groupStore.trials[currentTrial].I_1ST_ORDER_EXPECTATION;
  let T_prediction = $groupStore.trials[currentTrial].T_PREDICTION;
  let I_earnings = $groupStore.trials[currentTrial].I_EARNED;
  let T_earnings = $groupStore.trials[currentTrial].T_EARNED;
  let I_received = $groupStore.trials[currentTrial].T_CHOICE;
  let T_received = $groupStore.trials[currentTrial].I_CHOICE;
  let trusteeReceivedMultiplied = T_received * globalVars.multiplier;
  let counterfactualAmount =
    $userStore.role === "investor"
      ? T_received - getRandomInt(T_received)
      : I_received - getRandomInt(I_received);

  const otherName =
    $userStore.role === "investor" ? $groupStore.T_name : $groupStore.I_name;

  const otherExpected =
    $userStore.role === "investor"
      ? `${otherName} expected you to return $${T_prediction} out of $${endowment}.`
      : `${otherName} expected you to return $${I_expectation} out of $${trusteeReceivedMultiplied}.`;

  let questions;

  // Initialize all scales to their mid-point assumpting they're 100pt scales
  let r1 = 50;
  let r2 = 50;

  // Initialize all the question texts
  if ($userStore.role == "investor") {
    questions = [
      {
        questionText: `How guilty do you feel?`,
        type: "guilt",
        rating: r1,
      },
      {
        questionText: `How guilty would you feel if you returned $${counterfactualAmount}?`,
        type: "angry",
        rating: r2,
      },
    ];
  } else if ($userStore.role === "trustee") {
    questions = [
      {
        questionText: `How guilty do you feel?`,
        type: "guilt",
        rating: r1,
      },
      {
        questionText: `How guilty would you feel if you returned $${counterfactualAmount}?`,
        type: "angry",
        rating: r2,
      },
    ];
  }

  async function getNextTrial() {
    submitted = true;
    await saveQData(questions);
    dispatch("to-phase-fixation");
  }
</script>

{#if submitted}
  <Loading text={"Waiting for your partner..."} />
{:else}
  <div class="w-1/2 mx-auto">
    <div class="min-w-full pb-32 text-center">
      <p class="mb-1 text-lg">
        {otherExpected}
      </p>

      {#each questions as question, i}
        {#if i === 2 || i == 6}
          <hr class="w-full my-16 border-black border-dashed" />
        {/if}
        {#if question.questionText.includes("compensate")}
          <div class="my-8">
            <Rating
              questionText={question.questionText}
              bind:rating={question.rating}
              min={"0"}
              max={globalVars.receiverEndowmentPerTrial / 2}
              leftText={"$0"}
              step={".01"}
              rightText={`$${globalVars.receiverEndowmentPerTrial / 2}`}
            />
          </div>
        {:else}
          <div class="my-8">
            <Rating
              questionText={question.questionText}
              bind:rating={question.rating}
              step={"1"}
            />
          </div>
        {/if}
      {/each}

      <Button on:click={getNextTrial}>Next</Button>
    </div>
  </div>
{/if}
