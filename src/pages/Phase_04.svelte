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
  import Rating from "../components/Rating.svelte";
  import Button from "../components/Button.svelte";

  const dispatch = createEventDispatcher();
  let showTrialParams = false;
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
  let trusteeReceivedMultiplied = T_received * globalVars.multiplier;

  const earnings = round2(
    $userStore.role === "investor" ? I_earnings : T_earnings
  );
  const expectedAmountFromOther =
    $userStore.role === "investor" ? I_expectation : T_prediction;
  const receivedAmount =
    $userStore.role === "investor" ? I_received : T_received;
  const keptAmount = round2(
    $userStore.role === "investor" ? endowment - T_received : T_received
  );

  const otherName =
    $userStore.role === "investor" ? $groupStore.T_name : $groupStore.I_name;

  const whoText = $userStore.role === "investor" ? "They" : "You";

  const outcomeExplanation =
    $userStore.role === "investor"
      ? {
          otherName: "You",
          started: "started",
          withEndowment: `with $${endowment}.`,
          whoExpected1: `${otherName}`,
          expected: "expected",
          youExpectAmount: `$${T_prediction}`,
          youActualReceived: `but received`,
          youActualReceivedAmount: `$${T_received}`,
          youActualReceivedFrom: `from you.`,
          withMultiplier: `With the multiplier, ${whoText.toLowerCase()} then had `,
          trusteeReceived: `$${trusteeReceivedMultiplied}.`,
          whoExpected2: "You",
          investorExpected: `$${I_expectation} from ${otherName} but they gave you $${I_received},`,
          trialResults: `resulting in a total earnings of $${earnings} for this trial.`,
        }
      : {
          otherName: otherName,
          started: "started",
          withEndowment: `with $${endowment}.`,
          whoExpected1: whoText,
          expected: "expected",
          youExpectAmount: `$${T_prediction}`,
          youActualReceived: `but received`,
          youActualReceivedAmount: `$${T_received}`,
          youActualReceivedFrom: `from ${otherName}.`,
          withMultiplier: `With the multiplier, ${whoText.toLowerCase()} then had `,
          trusteeReceived: `$${trusteeReceivedMultiplied}.`,
          whoExpected2: "They",
          investorExpected: `$${I_expectation} from you but you gave them $${I_received},`,
          trialResults: `resulting in a total earnings of $${earnings} for this trial.`,
        };

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
        questionText: `How guilty do you think ${outcomeExplanation.otherName} feels?`,
        type: "other_guilt",
        rating: r3,
      },
      {
        questionText: `How angry do you think ${outcomeExplanation.otherName} feels?`,
        type: "other_angry",
        rating: r4,
      },
      {
        questionText: `How close do you feel to ${outcomeExplanation.otherName}?`,
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
      <!-- <p class="mb-1 text-4xl">
        You earned <span class:text-green-500="{role == 
      'investor'}" class:text-red-500="{}">${earnings}</span> for this trial!
      </p> -->
      <p class="mb-1 text-4xl">
        You earned <span class="text-green-500">${earnings}</span> for this trial!
      </p>
      <p class="mb-1 text-lg">
        {outcomeExplanation.otherName}
        <span class="text-green-500">{outcomeExplanation.started}</span>
        {outcomeExplanation.withEndowment}
        {outcomeExplanation.whoExpected1}
        <span class="text-purple-500">{outcomeExplanation.expected}</span>
        {outcomeExplanation.youExpectAmount}
        {outcomeExplanation.youActualReceived}
        {outcomeExplanation.youActualReceivedAmount}
        {outcomeExplanation.youActualReceivedFrom}
        {outcomeExplanation.withMultiplier}
        {outcomeExplanation.trusteeReceived}
        {outcomeExplanation.whoExpected2}
        <span class="text-purple-500">{outcomeExplanation.expected}</span>
        {outcomeExplanation.investorExpected}
        {outcomeExplanation.trialResults}
      </p>
      <!-- Svelte HTML evaluator -->
      <!-- @html{eval} -->
      {#each questions as question, i}
        {#if i === 2 || i == 6}
          <hr class="w-full my-16 border-black border-dashed" />
        {/if}
        {#if question.questionText.includes("compensate")}
          <div class="my-8">
            <Rating
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
            <Rating
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
