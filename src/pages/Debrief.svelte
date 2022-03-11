<script>
  import { groupStore, userStore, saveDebrief, globalVars } from "../utils";
  import { onMount } from "svelte";

  import Button from "../components/Button.svelte";
  let submitted = false;
  let age, sex, male, female, other, race, ethnicity, nativeLang, birth, handed;

  let bonus = 0;
  let recieverTotalBonus =
    $groupStore.trials.length * globalVars.receiverEndowmentPerTrial;

  function calculateBonus() {
    if ($userStore.role === "decider1") {
      $groupStore.trials.forEach(
        ({ endowment, D1_agency, D1_spent, R_D1_compensate }) => {
          R_D1_compensate = R_D1_compensate === undefined ? 0 : R_D1_compensate;
          bonus += endowment * D1_agency - D1_spent + R_D1_compensate;
        }
      );
    } else if ($userStore.role === "decider2") {
      $groupStore.trials.forEach(
        ({ endowment, D2_agency, D2_spent, R_D2_compensate }) => {
          R_D2_compensate = R_D2_compensate === undefined ? 0 : R_D2_compensate;
          bonus += endowment * D2_agency - D2_spent + R_D2_compensate;
        }
      );
    } else if ($userStore.role === "receiver") {
      $groupStore.trials.forEach(({ R_D1_compensate, R_D2_compensate }) => {
        R_D1_compensate = R_D1_compensate === undefined ? 0 : R_D1_compensate;
        R_D2_compensate = R_D2_compensate === undefined ? 0 : R_D2_compensate;
        recieverTotalBonus -= R_D1_compensate + R_D2_compensate;
      });
      bonus = recieverTotalBonus;
    }
  }

  async function debriefSubmit() {
    submitted = true;
    await saveDebrief({
      age,
      sex,
      ethnicity,
      race,
      nativeLang,
      birth,
      handed,
    });
  }

  onMount(calculateBonus);
</script>

<div class="w-full max-w-md mb-6">
  <div class="text-center">
    <h1 class="mb-4 text-2xl">Thanks for participating!</h1>
    <p class="italic">You earned a bonus of: ${Math.round(bonus)}</p>
  </div>
  {#if !submitted}
    <form
      class="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md"
      on:submit|preventDefault={debriefSubmit}
    >
      <div class="mb-4">
        <label class="block mb-2 text-sm font-bold text-gray-700" for="age">
          Age
        </label>
        <input
          class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          id="age"
          type="text"
          placeholder="Type your age in years"
          bind:value={age}
        />
      </div>
      <div class="mb-4">
        <label class="block mb-2 text-sm font-bold text-gray-700" for="sex">
          Gender
        </label>
        <select
          id="sex"
          name="sex"
          bind:value={sex}
          class="w-full px-3 py-2 leading-tight border rounded shadow focus:outline-none focus:shadow-outline"
        >
          <option value=""
            >Select the Gender that most accurately describes you</option
          >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div class="mb-4">
        <label for="race" class="mb-2 text-sm font-bold text-gray-700"
          >Race</label
        >
        <select
          id="race"
          name="race"
          bind:value={race}
          class="w-full px-3 py-2 leading-tight border rounded shadow focus:outline-none focus:shadow-outline"
        >
          <option value=""
            >Select the race that most accurately describes you</option
          >
          <option value="Asian">Asian / Asian-American</option>
          <option value="Black">Black / African-American</option>
          <option value="Native-American"
            >Native-American / Alaskan-Native</option
          >
          <option value="Pacific-Islander"
            >Pacific-Islander / Native-Hawaiian</option
          >
          <option value="White">White</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div class="mb-4">
        <label
          class="block mb-2 text-sm font-bold text-gray-700"
          for="ethnicity"
        >
          Ethnicity
        </label>
        <select
          id="ethnicity"
          name="ethnicity"
          bind:value={ethnicity}
          class="w-full px-3 py-2 leading-tight border rounded shadow focus:outline-none focus:shadow-outline"
        >
          <option value=""
            >Select the Ethnicity that most accurately describes you</option
          >
          <option value="Hispanic">Hispanic</option>
          <option value="Not-Hispanic">Not Hispanic</option>
        </select>
      </div>
      <div class="mb-6">
        <label
          class="block mb-2 text-sm font-bold text-gray-700"
          for="nativeLang"
        >
          Native Language
        </label>
        <input
          class="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          id="nativeLang"
          type="text"
          placeholder="What is your native language"
          bind:value={nativeLang}
        />
      </div>
      <div class="mb-6">
        <label class="block mb-2 text-sm font-bold text-gray-700" for="birth">
          Birth Date
        </label>
        <input
          class="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          id="birth"
          type="text"
          placeholder="Type your birth date in the format DD/MM/YYYY"
          bind:value={birth}
        />
      </div>
      <div class="mb-4">
        <label class="block mb-2 text-sm font-bold text-gray-700" for="handed">
          Handedness
        </label>
        <select
          id="handed"
          name="handed"
          bind:value={handed}
          class="w-full px-3 py-2 leading-tight border rounded shadow focus:outline-none focus:shadow-outline"
        >
          <option value=""
            >Select the Handedness that most accurately describes you</option
          >
          <option value="Right">Right-Handed</option>
          <option value="Left">Left-Handed</option>
        </select>
      </div>
      <div class="text-center">
        <Button type={"submit"} color={"blue"}>Submit</Button>
      </div>
    </form>
  {/if}
</div>
