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
    <h1 class="mb-4 text-2xl">Instructions for Part 2</h1>
    <p class="w-1/2 mb-4 text-left">
      In this experiment demo, a random selection of <span class="font-bold"
        >{$groupStore.trials.length} trials</span
      >
      of a Trust Game will be played by you and your partner. Each trial will progress
      through several phases indicated by the diagram below:
    </p>
    <StatusHeaderExample />
    <!-- #TODO: Update instructions text as needed to clarify phases above -->
    <p class="w-1/2 my-4 text-left">
      Each trial will begin by asking you some questions during the <span
        class="font-bold">Pre-Stimulation</span
      >
      phase. Then the experimenter will setup the thermode on the Receiver during
      the <span class="font-bold">Thermode Placement</span> phase. Next
      stimulation will be delivered for the duration based on the Deciders'
      combined choices in the <span class="font-bold">Stimulation</span> phase.
      Lastly, you will answer some questions during the
      <span class="font-bold">Post-Stimulation</span> phase. This sequence will
      repeat for a total of
      <span class="font-bold">{$groupStore.trials.length} trials</span>.
    </p>

    {#if $userStore.role === "trustee"}
      <hr class="w-1/2 my-2 border border-black border-dashed" />
      <p class="w-1/2 mt-4 text-left">
        As the Receiver, you will have the opportunity to compensate each
        Decider for the choices they made and the resulting pain you
        experienced. You will be allotted a total endowment of ${globalVars.receiverEndowmentPerTrial *
          $groupStore.trials.length} for this part of the experiment split into ${globalVars.receiverEndowmentPerTrial}
        per trial. During the <span class="font-bold">Post-Stimulation</span>
        phase, you can choose how much of this endowment to compensate each Decider.
        This is optional, and any money you don't spend each trial will awarded to
        you as a bonus payment at the end of the experiment. <br />
      </p>
      <p class="w-1/3 mb-4 text-center">
        <span class="font-bold">Only you</span> are aware about your option to compensate
        Deciders on each trial. Please keep this information to yourself during the
        experiment.
      </p>
    {/if}
    <Button on:click={goto_phase_01}>Next</Button>
  </div>
{/if}
