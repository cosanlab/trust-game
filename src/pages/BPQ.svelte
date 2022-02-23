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

  const dispatch = createEventDispatcher();
  const displayTime = 5000; // how long to show real choices for
  let submitted = false;
  let disableInput = false;
  let currentQ = 0;
  let showButton = true;
  let switchToRatingScale = false;
  let questions;

  // GET TRIAL DATA
  // Agency and choices; we'll only use 1 for the deciders but both for the receiver
  let agency1 = $groupStore.trials[$groupStore.currentTrial].D1_agency;
  let actualChoice1 = round2(
    $groupStore.trials[$groupStore.currentTrial].D1_spent
  );
  let agency2 = $groupStore.trials[$groupStore.currentTrial].D2_agency;
  let actualChoice2 = round2(
    $groupStore.trials[$groupStore.currentTrial].D2_spent
  );
  // Shared endowment
  let endowment = $groupStore.trials[$groupStore.currentTrial].endowment;
  // Cost
  let multiplier = $groupStore.trials[$groupStore.currentTrial].cost;
  multiplier = globalVars.costConversion[multiplier];

  // Just for deciders
  const selfAgency = $userStore.role === "decider1" ? agency1 : agency2;
  const otherAgency = $userStore.role === "decider1" ? agency2 : agency1;
  const selfChoice =
    $userStore.role === "decider1" ? actualChoice1 : actualChoice2;
  const otherChoice =
    $userStore.role === "decider1" ? actualChoice2 : actualChoice1;
  const otherName =
    $userStore.role === "decider1" ? $groupStore.D2_name : $groupStore.D1_name;

  // Now setup rating scales
  let d_r = 0.5 * (selfAgency * endowment); // either decider's expectation of receiver
  let d_d = 0.5 * (otherAgency * endowment); // either decider's expectation of other
  let closeness = 50; // decider closeness
  // Receiver expectations
  let r_d1 = 0.5 * (agency1 * endowment);
  let r_d2 = 0.5 * (agency2 * endowment);

  if ($userStore.role == "decider1" || $userStore.role === "decider2") {
    questions = [
      {
        questionText: `How much do you think ${$groupStore.R_name} expected you to spend?`,
        rating: d_r,
        agency: selfAgency,
        questionType: "self",
        endowment: endowment,
        multiplier: multiplier,
      },
      {
        questionText: `You actually spent:`,
        rating: selfChoice,
        agency: selfAgency,
        questionType: "self",
        endowment: endowment,
        multiplier: multiplier,
      },
      {
        questionText: `How much did you expect ${otherName} to spend?`,
        rating: d_d,
        agency: otherAgency,
        questionType: "other",
        endowment: endowment,
        multiplier: multiplier,
      },
      {
        questionText: `${otherName} actually spent:`,
        rating: otherChoice,
        agency: otherAgency,
        questionType: "other",
        endowment: endowment,
        multiplier: multiplier,
      },
      {
        questionText: `How close do you feel to ${otherName}?`,
        rating: closeness,
      },
    ];
  } else {
    questions = [
      {
        questionText: `How much did you expect ${$groupStore.D1_name} to spend?`,
        rating: r_d1,
        agency: agency1,
        questionType: "other",
        endowment: endowment,
        multiplier: multiplier,
      },
      {
        questionText: `${$groupStore.D1_name} actually spent:`,
        rating: actualChoice1,
        agency: agency1,
        questionType: "other",
        endowment: endowment,
        multiplier: multiplier,
      },
      {
        questionText: `How much did you expect ${$groupStore.D2_name} to spend?`,
        rating: r_d2,
        agency: agency2,
        questionType: "other",
        endowment: endowment,
        multiplier: multiplier,
      },
      {
        questionText: `${$groupStore.D2_name} actually spent:`,
        rating: actualChoice2,
        agency: agency2,
        questionType: "other",
        endowment: endowment,
        multiplier: multiplier,
      },
    ];
  }

  async function goToThermode_Placement() {
    submitted = true;
    await saveBPQData(questions);
    dispatch("to-thermode_placement");
  }

  async function getNextQuestion() {
    // If they're done answering move to next state
    if (currentQ === questions.length - 1) {
      await goToThermode_Placement();
    } else {
      currentQ = currentQ + 1;
      // If they're at the 2nd or 4th, we're just showing them a choice, no rating
      if (currentQ === 1 || currentQ === 3) {
        showButton = false;
        disableInput = true;
        setTimeout(getNextQuestion, displayTime);
      } else if (
        // Otherwise for the last question for deciders we're using a 100pt scale
        ($userStore.role === "decider1" || $userStore.role === "decider2") &&
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
  <div class="w-1/2 mx-auto">
    <div class="min-w-full pb-32 text-center">
      <div class="my-10">
        {#if switchToRatingScale}
          <Rating
            questionText={questions[currentQ].questionText}
            bind:rating={questions[currentQ].rating}
          />
        {:else}
          <PainScale
            bind:rating={questions[currentQ].rating}
            questionText={questions[currentQ].questionText}
            endowment={questions[currentQ].endowment}
            multiplier={questions[currentQ].multiplier}
            agency={questions[currentQ].agency}
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
