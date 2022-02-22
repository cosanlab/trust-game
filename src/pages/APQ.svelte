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
  // Other decider's name just for deciders
  const otherName =
    $userStore.role === "decider1" ? $groupStore.D2_name : $groupStore.D1_name;

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
        questionText: `How guilty do you ${otherName} feels?`,
        rating: r3,
      },
      {
        questionText: `How responsible do you think ${otherName} feels?`,
        rating: r4,
      },
      {
        questionText: `How close do you feel to ${otherName}?`,
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
        questionText: `How angry do you feel towards ${$groupStore.D1_name}?`,
        rating: r3,
      },
      {
        questionText: `How angry you feel towards ${$groupStore.D2_name}?`,
        rating: r4,
      },
      {
        questionText: `How indebted do you feel towards ${$groupStore.D1_name}?`,
        rating: r5,
      },
      {
        questionText: `How indebted do you feel towards ${$groupStore.D2_name}?`,
        rating: r6,
      },
      {
        questionText: `How much gratitude do you feel towards ${$groupStore.D1_name}?`,
        rating: r7,
      },
      {
        questionText: `How much gratitude do you feel towards ${$groupStore.D2_name}?`,
        rating: r8,
      },
      // TODO: Replace with different rating scale?
      {
        questionText: `How much do you want to compensate ${$groupStore.D1_name}?`,
        rating: r9,
      },
      {
        questionText: `How much do you want to compensate ${$groupStore.D2_name}?`,
        rating: r10,
      },
    ];
  }

  // TODO: save data for real by looping over questions
  async function getNextTrial() {
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
    // await saveData(data)
    dispatch("get-next-trial");
  }
</script>

{#if submitted}
  <Loading text={"Waiting for other participants..."} />
{:else}
  <div class="w-3/4 mx-auto">
    <div class="min-w-full pb-32 text-center">
      {#each questions as { questionText, rating }}
        <div class="my-10">
          <Rating {questionText} bind:rating />
        </div>
      {/each}

      <Button on:click={getNextTrial}>Next</Button>
    </div>
  </div>
{/if}
