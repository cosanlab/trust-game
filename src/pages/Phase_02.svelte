<!-- #TODO: Investor makes 1st order rating; Trustee makes 2nd order rating. Again UI
diff is just in question phrasing.


Data needed:
- Investor Endowment -> DB
- Multiplier -> globals in utils.js

Data stored/modified:
- Investor 1st order -- "i wonder how much trustee will return to me"
- Trustee 2nd order -- "i wonder how much investor expects me to return to them"
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
  import PainScale from "../components/PainScale.svelte";
  import Rating from "../components/Rating.svelte";
  import Button from "../components/Button.svelte";

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
  let endowment = $groupStore.trials[$groupStore.currentTrial].endowment;

  const otherName =
    $userStore.role === "investor" ? $groupStore.T_name : $groupStore.I_name;

  // Now setup rating scales
  let i_r = 0.5 * endowment; // investor's rating
  let t_r = 0.5 * endowment; // trustee's rating

  if ($userStore.role == "investor") {
    questions = [
      {
        questionText: `How much do you think ${$groupStore.T_name} will return to you?`,
        rating: i_r,
        questionType: "other",
        endowment: endowment,
      },
    ];
  } else {
    // For Trustee we ask how much they expect the investor to share with them
    questions = [
      {
        questionText: `How much do you think ${$groupStore.I_name} expects you to return to them?`,
        rating: t_r,
        questionType: "self",
        endowment: endowment,
      },
    ];
  }

  console.log("questions", questions);

  async function goto_phase_03() {
    submitted = true;
    await saveQData(questions);
    dispatch("to-phase-03");
  }

  async function getNextQuestion() {
    console.log("currentQ", currentQ);
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
  <Loading text={"Waiting for other participants..."} />
{:else}
  <div class="w-3/5 mx-auto">
    <div class="min-w-full pb-32 text-center">
      <div class="my-10">
        {#if switchToRatingScale}
          <Rating
            questionText={questions[currentQ].questionText}
            bind:rating={questions[currentQ].rating}
          />
        {:else if $userStore.role === "investor"}
          <PainScale
            bind:rating={questions[currentQ].rating}
            questionText={questions[currentQ].questionText}
            endowment={questions[currentQ].endowment}
            questionType={questions[currentQ].questionType}
            disabled={disableInput}
          />
          <hr class="w-full my-8 border-black border-dashed" />
          <hr class="w-full my-4 border-white" />
        {:else if $userStore.role === "trustee"}
          <PainScale
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
