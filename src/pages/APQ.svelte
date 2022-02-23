<script>
  import { createEventDispatcher } from "svelte";
  import { userStore, groupStore, saveAPQData } from "../utils.js";
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
        type: "guilt",
        rating: r1,
      },
      {
        questionText: "How responsible did you feel?",
        type: "responsible",
        rating: r2,
      },
      {
        questionText: `How guilty do you think ${otherName} feels?`,
        type: "other_guilt",
        rating: r3,
      },
      {
        questionText: `How responsible do you think ${otherName} feels?`,
        type: "other_responsible",
        rating: r4,
      },
      {
        questionText: `How close do you feel to ${otherName}?`,
        type: "close",
        rating: r5,
      },
      {
        questionText: "How satisfied are you with the decision?",
        type: "satisfied",
        rating: r6,
      },
    ];
  } else {
    questions = [
      {
        questionText: "How much pain did you feel?",
        type: "pain",
        rating: r1,
      },
      {
        questionText: "How satisfied are you with the decision?",
        type: "satisfied",
        rating: r2,
      },
      {
        questionText: `How angry do you feel towards ${$groupStore.D1_name}?`,
        type: "D1_anger",
        rating: r3,
      },
      {
        questionText: `How angry you feel towards ${$groupStore.D2_name}?`,
        type: "D2_anger",
        rating: r4,
      },
      {
        questionText: `How indebted do you feel towards ${$groupStore.D1_name}?`,
        type: "D1_indebted",
        rating: r5,
      },
      {
        questionText: `How indebted do you feel towards ${$groupStore.D2_name}?`,
        type: "D2_indebted",
        rating: r6,
      },
      {
        questionText: `How much gratitude do you feel towards ${$groupStore.D1_name}?`,
        type: "D1_gratitude",
        rating: r7,
      },
      {
        questionText: `How much gratitude do you feel towards ${$groupStore.D2_name}?`,
        type: "D2_gratitude",
        rating: r8,
      },
      // TODO: Replace with different rating scale?
      {
        questionText: `How much do you want to compensate ${$groupStore.D1_name}?`,
        type: "D1_compensate",
        rating: r9,
      },
      {
        questionText: `How much do you want to compensate ${$groupStore.D2_name}?`,
        type: "D2_compensate",
        rating: r10,
      },
    ];
  }

  async function getNextTrial() {
    submitted = true;
    await saveAPQData(questions);
    dispatch("get-next-trial");
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

      <Button on:click={getNextTrial}>Next</Button>
    </div>
  </div>
{/if}
