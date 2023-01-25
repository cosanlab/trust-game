<!-- Investor makes 1st order rating; Trustee makes 2nd order rating. 
  Again UI diff is just in question phrasing.

  Data needed:
  - [x] Investor Endowment -> DB
  - [x] Multiplier -> globals in utils.js

  Data stored/modified:
  - [x] Investor 1st order -- "i wonder how much trustee will return to me"
  - [x] Trustee 2nd order -- "i wonder how much investor expects me to return to them"
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
  import EndowmentScale from "../components/EndowmentScale.svelte";
  import Rating from "../components/Rating.svelte";
  import Button from "../components/Button.svelte";

  const dispatch = createEventDispatcher();
  let visibleTrialParams = false;
  let submitted = false;
  let disableInput = false;
  let currentQ = 0;
  let showButton = true;
  let questions;

  // GET TRIAL DATA
  // Shared endowment
  let endowment = $groupStore.trials[$groupStore.currentTrial].endowment;
  let investedAmount = $groupStore.trials[$groupStore.currentTrial].I_CHOICE;
  let multiplier = globalVars.multiplier;

  const otherName =
    $userStore.role === "investor" ? $groupStore.T_name : $groupStore.I_name;

  // Now setup rating scales
  let i_predict = 0.5 * (investedAmount * multiplier); // investor's rating
  let t_expect = 0.5 * (investedAmount * multiplier); // trustee's rating

  if ($userStore.role == "investor") {
    questions = [
      {
        questionText: `How much do you think ${$groupStore.T_name} will return to you?`,
        rating: i_predict,
        questionType: "other",
        endowment: investedAmount * multiplier,
      },
    ];
  } else {
    // For Trustee we ask how much they expect the investor to share with them
    questions = [
      {
        questionText: `How much do you think ${$groupStore.I_name} expects you to return to them?`,
        rating: t_expect,
        questionType: "self",
        endowment: investedAmount * multiplier,
      },
    ];
  }

  async function goto_phase_03() {
    submitted = true;
    await saveQData(questions);
    dispatch("to-phase-03");
  }

  async function getNextQuestion() {
    // If they're done answering move to next state
    if (currentQ === questions.length - 1) {
      await goto_phase_03();
    } else {
      currentQ = currentQ + 1;
      showButton = true;
      switchToRatingScale = false;
      disableInput = false;
    }
  }
</script>

{#if submitted}
  <Loading text={"Waiting for your partner..."} />
{:else}
  <!-- TODO: where a prop for EndowmentScale would be helpful -->
  <div class="w-3/5 mx-auto">
    <div class="min-w-full pb-32 text-center">
      <div class="my-10">
        {#if $userStore.role === "investor"}
          <EndowmentScale
            bind:rating={questions[currentQ].rating}
            questionText={questions[currentQ].questionText}
            endowment={questions[currentQ].endowment}
            questionType={questions[currentQ].questionType}
            disabled={disableInput}
            visibleParams={visibleTrialParams}
          />
        {:else if $userStore.role === "trustee"}
          <EndowmentScale
            bind:rating={questions[currentQ].rating}
            questionText={questions[currentQ].questionText}
            endowment={questions[currentQ].endowment}
            questionType={questions[currentQ].questionType}
            disabled={disableInput}
            visibleParams={visibleTrialParams}
          />
        {/if}
        {#if showButton}
          <Button on:click={getNextQuestion}>Next</Button>
        {/if}
      </div>
    </div>
  </div>
{/if}
