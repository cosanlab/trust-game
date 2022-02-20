<script>
  import { createEventDispatcher } from "svelte";
  import { userStore, groupStore, saveData } from "../utils.js";
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

  // TODO: Change me to real data
  // dummy data
  let agency = 0.5; // .1 - 1
  let endowment = 20; // the shared endowment
  let multiplier = 1; // cost
  let r1 = 0.5 * (agency * endowment); // initialize to mid-point of scale
  let r2 = 0.5 * (agency * endowment); // initialize to mid-point of scale
  let actualChoice = 0.75 * (agency * endowment); // simulate actual choice;
  let r3 = 50; // closeness q
  if ($userStore.role == "decider1" || $userStore.role === "decider2") {
    questions = [
      {
        questionText:
          "How much do you think the receiver expected you to spend?",
        rating: r1,
      },
      {
        questionText: "How much did you expect the other decider to spend?",
        rating: r2,
      },
      {
        questionText: "The other decider actually spent:",
        rating: actualChoice,
      },
      {
        questionText: "How close do you feel to the other decider?",
        rating: r3,
      },
    ];
  } else {
    questions = [
      {
        questionText: "How much did you expect decider 1 to spend?",
        rating: r1,
      },
      {
        questionText: "How much did you expect decider 2 to spend?",
        rating: r2,
      },
    ];
  }

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
    // TODO: change me. This is the value from just the first scale until we save data for real
    data[key] = r1;
    await saveData($groupStore.groupId, data);
    dispatch("to-thermode_placement");
  }

  async function getNextQuestion() {
    if (currentQ === questions.length - 1) {
      await goToThermode_Placement();
    } else {
      currentQ = currentQ + 1;
      if (
        ($userStore.role === "decider1" || $userStore.role === "decider2") &&
        currentQ === questions.length - 2
      ) {
        // Before showing the deciders their last q we need to show them what the other
        // decider actually chose
        showButton = false;
        disableInput = true;
        setTimeout(getNextQuestion, displayTime);
      } else if (
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
            questionText={questions[currentQ].questionText}
            bind:rating={questions[currentQ].rating}
            {endowment}
            {multiplier}
            {agency}
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
