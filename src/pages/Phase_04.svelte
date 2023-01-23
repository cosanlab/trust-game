<!-- Single outcome screen that shows how much each person made based upon the 
  previous phase in addition to the expectation outcomes. 

  Only rendering differences are:
  - the amount of money based on role
  - phase 2's expectation ratings 

  TODO: Check with Luke:
  We could also need to render rating scales, with the question wording being different:
  Trustee: how angry/satisfied
  Investor: how guilty/satisfied

  Data needed:
  - [x] Investor expectation from phase 2 -> DB
  - [x] Trustee expectation from phase 2 -> DB
  - [x] Investor earned from phase 3 -> DB
  - [x] Trustee earned from phase 3 -> DB

  Data stored/modified:
  - [x] Investor anger/satisfcation
  - [x] Trustee guilt/satisfcation
-->
<script>
  import { createEventDispatcher } from "svelte";
  import {
    userStore,
    groupStore,
    saveAPQData,
    globalVars,
    saveQData,
    round2,
  } from "../utils.js";
  import Loading from "../components/Loading.svelte";
  import MouseRating from "../components/MouseRating.svelte";
  import Button from "../components/Button.svelte";

  const dispatch = createEventDispatcher();
  let submitted = false;

  // GET TRIAL DATA
  let currentTrial = $groupStore.currentTrial;
  let totalTrials = $groupStore.trials.length;

  // Shared endowment
  let endowment = $groupStore.trials[currentTrial].endowment;
  let I_expectation = $groupStore.trials[currentTrial].I_1ST_ORDER_EXPECTATION;
  let T_prediction = $groupStore.trials[currentTrial].T_PREDICTION;
  let I_earnings = $groupStore.trials[currentTrial].I_EARNED;
  let T_earnings = $groupStore.trials[currentTrial].T_EARNED;
  let I_received = $groupStore.trials[currentTrial].T_CHOICE;
  let T_received = $groupStore.trials[currentTrial].I_CHOICE;

  const earnings = round2(
    $userStore.role === "investor" ? I_earnings : T_earnings
  );
  const expectFromOther =
    $userStore.role === "investor" ? I_expectation : T_prediction;
  const receivedAmount =
    $userStore.role === "investor" ? I_received : T_received;
  const keptAmount = round2(
    $userStore.role === "investor" ? endowment - T_received : T_received
  );
  const otherName =
    $userStore.role === "investor" ? $groupStore.T_name : $groupStore.I_name;

  const outcomeExplanation =
    $userStore.role === "investor"
      ? `You started with $${endowment} and gave $${T_received} to ${otherName}, keeping $${keptAmount} for yourself.
        With the multiplier, ${otherName} then had $${
          T_received * globalVars.multiplier
        }. You expected $${expectFromOther} but received $${receivedAmount} from ${otherName},
        resulting in a total earnings of $${earnings}
        for this trial.`
      : `${otherName} started with $${endowment}. You expected $${expectFromOther} but received $${receivedAmount} from ${otherName}.
        With the multiplier, you then had $${
          receivedAmount * globalVars.multiplier
        }. ${otherName} expected $${I_expectation} from you but you gave $${I_received} to ${otherName},
        resulting in a total earnings of $${earnings} for this trial.`;

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

  // Initialize all the question texts
  if ($userStore.role == "investor" || $userStore.role === "trustee") {
    questions = [
      {
        questionText: "How guilty do you feel?",
        type: "guilt",
        rating: r1,
      },
      {
        questionText: "How angry do you feel?",
        type: "angry",
        rating: r2,
      },
      {
        questionText: `How guilty do you think ${otherName} feels?`,
        type: "other_guilt",
        rating: r3,
      },
      {
        questionText: `How angry do you think ${otherName} feels?`,
        type: "other_angry",
        rating: r4,
      },
      {
        questionText: `How close do you feel to ${otherName}?`,
        type: "close",
        rating: r5,
      },
      {
        questionText: "How satisfied are you with this outcome?",
        type: "satisfied",
        rating: r6,
      },
    ];
  }

  async function getNextTrial() {
    submitted = true;
    await saveQData(questions);
    console.log("finished phase-04");
    dispatch("get-next-trial");
  }
</script>

{#if submitted}
  <Loading text={"Waiting for your partner..."} />
{:else}
  <div class="w-1/2 mx-auto">
    <div class="min-w-full pb-32 text-center">
      <p class="mb-1 text-4xl">
        You earned ${earnings} for this trial!
      </p>
      <p class="mb-1 text-lg">
        {outcomeExplanation}
      </p>

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
