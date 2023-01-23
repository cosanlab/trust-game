<!-- #TODO: Update this so Investor sees endowment and makes a decision to share. The
slider should show BOTH the *calculated* amount as well as the *original* amount:
- original == whatever the endowment is in the database 
- calculate = original * multiplier

Trustee sees the same, but makes a prediction about how much they think the Investor
will give them.

So only real logic in UI is the difference in question phrasing

Data needed:
- [x] Investor Endowment -> DB
- [x] Multiplier -> globals in utils.js

Data stored/modified:
- [x] Investor choice
- [x] Trustee prediction
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
  let multiplier = globalVars.multiplier;

  const otherName =
    $userStore.role === "investor" ? $groupStore.T_name : $groupStore.I_name;

  // Now setup rating scales
  let i_choice = 0.5 * endowment;
  let t_predict = 0.5 * endowment;

  if ($userStore.role == "investor") {
    questions = [
      {
        questionText: `How much of the $${endowment} do you want to invest in ${$groupStore.T_name}?`,
        rating: i_choice,
        questionType: "self",
        endowment: endowment,
      },
    ];
  } else {
    // For Trustee we ask how much they predict the investor to share with them
    questions = [
      {
        questionText: `How much do you predict ${$groupStore.I_name} will invest in you?`,
        rating: t_predict,
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
  <Loading text={"Waiting for your partner..."} />
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
