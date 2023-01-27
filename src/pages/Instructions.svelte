<script>
  import { createEventDispatcher } from "svelte";
  import {
    userId,
    userStore,
    groupStore,
    saveName,
    globalVars,
  } from "../utils.js";
  import Loading from "../components/Loading.svelte";
  import Button from "../components/Button.svelte";
  import StatusHeaderExample from "../components/StatusHeaderExample.svelte";

  let submitted = false;
  const dispatch = createEventDispatcher();

  async function goto_phase_01() {
    submitted = true;
    await saveName($userStore.name);
    dispatch("to-phase-01");
  }
</script>

{#if submitted}
  <Loading text={"Waiting for your partner..."} />
{:else}
  <div class="flex flex-col items-center">
    <h1 class="mb-4 text-2xl">Instructions for The Trust Game</h1>
    <p class="w-1/2 mb-4 text-left">
      In this experiment demo, a random selection of <span class="font-bold"
        >{$groupStore.trials.length} trials</span
      >
      of a Trust Game will be played by you and your partner. Each trial will progress
      through several phases indicated by the diagram below:
    </p>
    <StatusHeaderExample />
    <!-- #TODO: Update instructions text as needed to clarify phases above -->
    {#if $userStore.role === "investor"}
      <hr class="w-1/2 my-2 border border-black border-dashed" />
      <p class="w-1/2 mt-4 text-left">
        <span class="font-bold">[Phase 1: Investor Makes an Offer]</span><br
        />As the
        <span class="underline">Investor</span>, you will be presented with an
        amount of money, an endowment (e.g., $5), and must decide how much of it
        to invest in your partner, the Trustee. You will keep what you don't
        choose to invest. The amount you invest in your partner will then be
        multiplied by a factor of {globalVars.multiplier}
        before being sent. As an example, if you invest $1, your partner will receive
        ${globalVars.multiplier}.<br /> <br />
        <span class="font-bold">[Phase 2: Expectation Ratings]</span><br />You
        will report how much of the money you expect your partner to return to
        you. <br /><br />
        <span class="font-bold">[Phase 3: Trustee Makes Return Decision]</span
        ><br />
        You will wait while your partner decides how much money to return to you.
        <br /><br />
        <span class="font-bold">[Phase 4: Trial Outcome]</span><br />
        You will learn the how much money you received.<br /><br />
        <span class="font-bold">[Phase 5: Counterfactual rating]</span><br />
        You will report how you feel about the trial outcome.
      </p>
    {/if}
    {#if $userStore.role === "trustee"}
      <hr class="w-1/2 my-2 border border-black border-dashed" />
      <p class="w-1/2 mt-4 text-left">
        <span class="font-bold">[Phase 1: Investor Makes an Offer]</span><br />
        Your partner, the Investor, will be presented with an amount of money, an
        endowment (e.g., $5). Your partner will decide how much of it to invest in
        you, the <span class="underline">Trustee</span>. The amount your partner
        invests will be multiplied by a factor of {globalVars.multiplier}
        before being given to you. As an example, if they choose to invest $1, keeping
        $4 for themselves, you will receive ${globalVars.multiplier}.<br /><br
        />
        <span class="font-bold">[Phase 2: Expectation Ratings]</span><br />
        You will report how much of the money you think your partner expects to receive
        from you.<br /><br />
        <span class="font-bold">[Phase 3: Trustee Makes Return Decision]</span
        ><br />
        You will decide how much money to return to your partner.<br /><br />
        <span class="font-bold">[Phase 4: Trial Outcome]</span><br />
        You will learn the how much money you received.<br /><br />
        <span class="font-bold">[Phase 5: Counterfactual rating]</span><br />
        You will report how you feel about the trial outcome.
      </p>
    {/if}
    <Button on:click={goto_phase_01}>Next</Button>
  </div>
{/if}
