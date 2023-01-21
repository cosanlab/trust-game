<!-- #TODO: update so that investor sees a "waiting for trustee" screen. Trustee makes
rating to give back on the *calculated* number scale


Data needed:
- Investor decision in phase 1
- Multiplier -> globals in utils.js

Data stored/modified:
- Trustee decision
- Trustee earned = offer from phase 1 * multiplier - returned
- Investor earned = kept in phase 1 + returned by Trustee (after multiplier)

-->
<script>
  import { createEventDispatcher } from "svelte";
  import {
    userStore,
    groupStore,
    saveQData,
    round2,
    globalVars,
  } from "../utils.js";
  import Loading from "../components/Loading.svelte";
  import PainScale from "../components/EndowmentScale.svelte";
  import Rating from "../components/Rating.svelte";
  import Button from "../components/Button.svelte";
  import EndowmentScale from "../components/EndowmentScale.svelte";

  console.log("userStore", $userStore);
  console.log("groupStore", $groupStore);
  console.log("globalVars", globalVars);

  const dispatch = createEventDispatcher();
  let submitted = false;
  let disableInput = false;
  let currentQ = 0;
  let showButton = true;
  let switchToRatingScale = false;
  let questions;

  // GET TRIAL DATA
  // Shared endowment
  let endowment = $groupStore.trials[$groupStore.currentTrial].I_CHOICE;
  let multiplier = globalVars.multiplier;

  const otherName =
    $userStore.role === "investor" ? $groupStore.T_name : $groupStore.I_name;

  // Now setup rating scales
  let t_choice = 0.5 * (endowment * multiplier); // trustee's rating

  if ($userStore.role == "trustee") {
    questions = [
      {
        questionText: `How much will you return to ${$groupStore.I_name}?`,
        rating: t_choice,
        questionType: "self",
        endowment: endowment * multiplier,
      },
    ];
  } else if ($userStore.role == "investor") {
    getNextQuestion();
  }

  console.log("questions", questions);

  async function goto_phase_04() {
    submitted = true;
    await saveQData(questions);
    dispatch("to-phase-04");
  }

  async function getNextQuestion() {
    console.log("currentQ", currentQ);
    // If they're done answering move to next state
    if ($userStore.role === "investor") {
      showButton = false;
      await goto_phase_04();
    } else if (currentQ === questions.length - 1) {
      await goto_phase_04();
    } else {
      currentQ = currentQ + 1;
      showButton = true;
      disableInput = false;
    }
  }
</script>

{#if submitted}
  <Loading text={"Waiting for other participants..."} />
{:else}
  <div class="w-3/5 mx-auto">
    <div class="min-w-full pb-32 text-center">
      <div class="my-10">
        {#if $userStore.role === "investor"}
          <Loading text={"Waiting for Trustee..."} />
        {:else if $userStore.role === "trustee"}
          <EndowmentScale
            bind:rating={questions[currentQ].rating}
            questionText={questions[currentQ].questionText}
            endowment={questions[currentQ].endowment}
            questionType={questions[currentQ].questionType}
            disabled={disableInput}
          />
        {/if}
        {#if showButton}
          <Button on:click={getNextQuestion}>Next</Button>
        {/if}
      </div>
    </div>
  </div>
{/if}
