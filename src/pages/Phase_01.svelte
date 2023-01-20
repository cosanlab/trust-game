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
    saveBPQData,
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
  let agency1 = 1;
  let actualChoice1 = 0;
  let agency2 = 1;
  let actualChoice2 = 0;

  // Shared endowment
  let endowment = $groupStore.trials[$groupStore.currentTrial].endowment;

  // Just for deciders
  const selfAgency = $userStore.role === "investor" ? agency1 : agency2;
  const otherAgency = $userStore.role === "trustee" ? agency2 : agency1;
  const selfChoice =
    $userStore.role === "investor" ? actualChoice1 : actualChoice2;
  const otherChoice =
    $userStore.role === "investor" ? actualChoice2 : actualChoice1;
  const otherName =
    $userStore.role === "investor" ? $groupStore.T_name : $groupStore.I_name;

  // Now setup rating scales
  let d_i = 0.5 * (selfAgency * endowment); // either decider's expectation of receiver
  let d_t = 0.5 * (otherAgency * endowment); // either decider's expectation of other
  let closeness = 50; // decider closeness
  // Receiver expectations
  let r_d1 = 0.5 * (agency1 * endowment);
  let r_d2 = 0.5 * (agency2 * endowment);

  if ($userStore.role == "investor") {
    questions = [
      {
        questionText: `How much do you want to give to ${$groupStore.T_name}?`,
        rating: d_i,
        questionType: "self",
        endowment: endowment,
      },
      {
        questionText: `You actually spent:`,
        rating: selfChoice,
        questionType: "self",
        endowment: endowment,
      },
      {
        questionText: `How much did you expect ${otherName} to spend?`,
        rating: d_t,
        questionType: "other",
        endowment: endowment,
      },
      {
        questionText: `${otherName} actually spent:`,
        rating: otherChoice,
        questionType: "other",
        endowment: endowment,
      },
      {
        questionText: `How close do you feel to ${otherName}?`,
        rating: closeness,
      },
    ];
  } else {
    // For Trustee we show expectation and actual questions simultaneously
    questions = [
      [
        {
          questionText: `How much did you expect ${$groupStore.I_name} to spend?`,
          rating: r_d1,
          questionType: "other",
          endowment: endowment,
        },
      ],
      [
        {
          questionText: `${$groupStore.I_name} actually spent:`,
          rating: actualChoice1,
          questionType: "other",
          endowment: endowment,
        },
      ],
    ];
  }

  console.log("questions", questions);

  async function goto_phase_02() {
    submitted = true;
    await saveBPQData(questions);
    dispatch("to-phase-02");
  }

  async function getNextQuestion() {
    console.log("currentQ", currentQ);
    // If they're done answering move to next state
    if (currentQ === questions.length - 1) {
      await goto_phase_02();
    } else {
      currentQ = currentQ + 1;
      // If they're at the 2nd or 4th, we're just showing them a choice, no rating
      if (currentQ === 1 || currentQ === 3) {
        // showButton = false;
        disableInput = true;
        // setTimeout(getNextQuestion, displayTime);
      } else if (
        // Otherwise for the last question for deciders we're using a 100pt scale
        $userStore.role === "investor" &&
        currentQ === questions.length - 1
      ) {
        showButton = true;
        switchToRatingScale = true;
        disableInput = false;
      } else {
        showButton = true;
        switchToRatingScale = false;
        disableInput = false;
      }
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
        {:else}
          <!-- $userStore.role === "trustee" -->
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
