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
    questions = {
      questionText: `You invested $${investedAmount} out of $${endowment}, which became $${
        investedAmount * multiplier
      }.\nHow much do you think ${$groupStore.T_name} will return to you?`,
      rating: i_predict,
      questionType: "other",
      endowment: investedAmount * multiplier,
    };
  } else {
    // For Trustee we ask how much they expect the investor to share with them
    questions = {
      questionText: `${
        $groupStore.I_name
      } invested $${investedAmount} out of $${endowment}, which became $${
        investedAmount * multiplier
      }.\nHow much do you think ${
        $groupStore.I_name
      } expects you to return to them?`,
      rating: t_expect,
      questionType: "self",
      endowment: investedAmount * multiplier,
    };
  }

  async function goto_phase_03() {
    submitted = true;
    await saveQData(questions);
    dispatch("to-phase-03");
  }
</script>

{#if submitted}
  <Loading text={"Waiting for your partner..."} />
{:else}
  <div class="w-3/5 mx-auto">
    <div class="min-w-full pb-32 text-center">
      <div class="my-10">
        <EndowmentScale
          bind:rating={questions.rating}
          questionText={questions.questionText}
          endowment={questions.endowment}
          questionType={questions.questionType}
          disabled={disableInput}
          visibleParams={visibleTrialParams}
        />
        {#if showButton}
          <Button on:click={goto_phase_03}>Next</Button>
        {/if}
      </div>
    </div>
  </div>
{/if}
