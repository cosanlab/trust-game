<!-- #TODO: Update this so Investor sees endowment and makes a decision to share. The
slider should show BOTH the *calculated* amount as well as the *original* amount:
- original == whatever the endowment is in the database 
- calculate = original * multiplier

Trustee sees the same, but makes a prediction about how much they think the Investor
will give them.

So only real logic in UI is the difference in question phrasing

Data needed:
- Investor Endowment -> DB
- Multiplier -> globals in utils.js

Data stored/modified:
- Investor choice
- Trustee prediction
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
  import Button from "../components/Button.svelte";

  console.log("userStore", $userStore);
  console.log("groupStore", $groupStore);
  console.log("globalVars", globalVars);

  const dispatch = createEventDispatcher();
  let submitted = false;
  let disableInput = false;
  let currentQ = 0;
  let showButton = true;
  let questions;

  // GET TRIAL DATA
  // Shared endowment
  let endowment = $groupStore.trials[$groupStore.currentTrial].endowment;

  const otherName =
    $userStore.role === "investor" ? $groupStore.T_name : $groupStore.I_name;

  // Now setup rating scales
  let d_i = 0.5 * endowment;
  let d_t = 0.5 * endowment;

  if ($userStore.role == "investor") {
    questions = [
      {
        questionText: `How much do you want to give to ${$groupStore.T_name}?`,
        rating: d_t,
        questionType: "self",
        endowment: endowment,
      },
    ];
  } else {
    // For Trustee we ask how much they expect the investor to share with them
    questions = [
      {
        questionText: `How much do you predict ${$groupStore.I_name} will give to you?`,
        rating: d_i,
        questionType: "other",
        endowment: endowment,
      },
    ];
  }

  console.log("questions", questions);

  async function goto_phase_02() {
    submitted = true;
    await saveQData(questions);
    dispatch("to-phase-02");
  }

  async function getNextQuestion() {
    console.log("currentQ", currentQ);
    // If they're done answering move to next state
    if (currentQ === questions.length - 1) {
      await goto_phase_02();
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
          <EndowmentScale
            bind:rating={questions[currentQ].rating}
            questionText={questions[currentQ].questionText}
            endowment={questions[currentQ].endowment}
            questionType={questions[currentQ].questionType}
            disabled={disableInput}
          />
          <hr class="w-full my-8 border-black border-dashed" />
          <hr class="w-full my-4 border-white" />
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
