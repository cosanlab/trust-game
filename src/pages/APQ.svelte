<script>
  import { createEventDispatcher } from "svelte";
  import { userStore, groupStore, saveData } from "../utils.js";
  import Loading from "../components/Loading.svelte";
  import Rating from "../components/Rating.svelte";
  import Button from "../components/Button.svelte";

  const dispatch = createEventDispatcher();
  let submitted = false;

  let questions;
  // Initialize all scales to their mid-point assumpting they're 100pt scales
  let r1 = 50;
  let r2 = 50;
  let r3 = 50;
  let r4 = 50;
  let r5 = 50;
  let r6 = 50;
  let r7 = 50;
  let r8 = 50;
  let r9 = 50;
  let r10 = 50;

  // Initialize all the question texts
  if ($userStore.role == "decider1" || $userStore.role === "decider2") {
    questions = [
      {
        questionText: "How guilty did you feel?",
        rating: r1,
      },
      {
        questionText: "How responsible did you feel?",
        rating: r2,
      },
      {
        questionText: "How guilty do you think the other decider feels?",
        rating: r3,
      },
      {
        questionText: "How responsible do you think the other decider feels?",
        rating: r4,
      },
      {
        questionText: "How close do you feel to the other decider?",
        rating: r5,
      },
      {
        questionText: "How satisfied are you with the decision?",
        rating: r6,
      },
    ];
  } else {
    questions = [
      {
        questionText: "How much pain did you feel?",
        rating: r1,
      },
      {
        questionText: "How satisfied are you with the decision?",
        rating: r2,
      },
      {
        questionText: "How angry do you feel towards Decider 1?",
        rating: r3,
      },
      {
        questionText: "How angry you feel towards Decider 2?",
        rating: r4,
      },
      {
        questionText: "How indebted do you feel towards Decider 1?",
        rating: r5,
      },
      {
        questionText: "How indebted do you feel towards Decider 2?",
        rating: r6,
      },
      {
        questionText: "How much gratitude do you feel towards Decider 1?",
        rating: r7,
      },
      {
        questionText: "How much gratitude do you feel towards Decider 2?",
        rating: r8,
      },
      // Replace with different rating scale?
      {
        questionText: "How much do you want to compensate Decider 1?",
        rating: r9,
      },
      {
        questionText: "How much do you want to compensate Decider 2?",
        rating: r10,
      },
    ];
  }

  // TODO: save data for real by looping over questions
  async function goToDebrief() {
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
    // await saveData($groupStore.groupId, data)
    dispatch("to-debrief");
  }
</script>

{#if submitted}
  <Loading text={"Waiting for other participants..."} />
{:else}
  <div class="w-1/2 mx-auto">
    <div class="min-w-full pb-32 text-center">
      {#each questions as { questionText, rating }}
        <div class="my-10">
          <Rating {questionText} bind:rating />
        </div>
      {/each}

      <Button on:click={goToDebrief}>Next</Button>
    </div>
  </div>
{/if}
