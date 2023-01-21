<!-- #TODO: Single outcome screen that shows how much each person made based upon the
previous phase in addition to the expectation outcomes. Only rendering differences are:

- the amount of money based on role
- phase 2's expectation ratings 

Check with Luke:
We could also need to render rating scales, with the question wording being different:
Trustee: how angry/satisfied
Investor: how guilty/satisfied

Data needed:
- Investor expectation from phase 2 -> DB
- Trustee expectation from phase 2 -> DB
- Investor earned from phase 3 -> DB
- Trustee earned from phase 3 -> DB

Data stored/modified:
- Investor anger/satisfcation
- Trustee guilt/satisfcation
-->
<script>
  import { createEventDispatcher } from "svelte";
  import { userStore, groupStore, saveAPQData, globalVars } from "../utils.js";
  import Loading from "../components/Loading.svelte";
  import MouseRating from "../components/MouseRating.svelte";
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
  // let r9 = 0.5 * (globalVars.receiverEndowmentPerTrial / 2);
  // let r10 = 0.5 * (globalVars.receiverEndowmentPerTrial / 2);

  let endowment_I_E = $groupStore.trials[$groupStore.currentTrial].I_E;
  let endowment_T_E = $groupStore.trials[$groupStore.currentTrial].T_E;

  const otherName =
    $userStore.role === "investor" ? $groupStore.T_name : $groupStore.I_name;

  // Initialize all the question texts
  if ($userStore.role == "investor" || $userStore.role === "trustee") {
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
      {#each questions as question, i}
        {#if i === 2 || i == 6}
          <hr class="w-full my-16 border-black border-dashed" />
        {/if}
        {#if question.questionText.includes("compensate")}
          <div class="my-8">
            <MouseRating
              questionText={question.questionText}
              bind:rating={question.rating}
              min={"0"}
              max={globalVars.receiverEndowmentPerTrial / 2}
              leftText={"$0"}
              step={".01"}
              rightText={`$${globalVars.receiverEndowmentPerTrial / 2}`}
            />
          </div>
        {:else}
          <div class="my-8">
            <MouseRating
              questionText={question.questionText}
              bind:rating={question.rating}
              step={"1"}
            />
          </div>
        {/if}
      {/each}

      <Button on:click={getNextTrial}>Next</Button>
    </div>
  </div>
{/if}
