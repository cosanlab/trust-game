<script>
  import { saveData, groupStore, userStore } from "src/utils";

  import Button from "../components/Button.svelte";
  let age,
    sex,
    male,
    female,
    other,
    race,
    ethnicity,
    nativeLang,
    birth,
    handed,
    feedback;
  async function debriefSubmit() {
    if ($userStore.role == "decider1") {
      await saveData($groupStore.groupId, {
        d1_age: age,
        d1_sex: sex,
        d1_ethnicity: ethnicity,
        d1_race: race,
        d1_nativeLang: nativeLang,
        d1_birth: birth,
        d1_handed: handed,
        d1_feedback: feedback,
      });
    } else if ($userStore.role == "decider2") {
      await saveData($groupStore.groupId, {
        d2_age: age,
        d2_sex: sex,
        d2_ethnicity: ethnicity,
        d2_race: race,
        d2_nativeLang: nativeLang,
        d2_birth: birth,
        d2_handed: handed,
        d2_feedback: feedback,
      });
    } else {
      await saveData($groupStore.groupId, {
        r_age: age,
        r_sex: sex,
        r_ethnicity: ethnicity,
        r_race: race,
        r_nativeLang: nativeLang,
        r_birth: birth,
        r_handed: handed,
        r_feedback: feedback,
      });
    }
  }
</script>

<div class="w-full max-w-md mb-6">
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
        <option value="female">Female</option>
      </select>
    </div>
    <div class="mb-4">
      <label for="race" class="mb-2 text-sm font-bold text-gray-700">Race</label
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
        <option value="Native-American">Native-American / Alaskan-Native</option
        >
        <option value="Pacific-Islander"
          >Pacific-Islander / Native-Hawaiian</option
        >
        <option value="White">White</option>
        <option value="Other">Other</option>
      </select>
    </div>
    <div class="mb-4">
      <label class="block mb-2 text-sm font-bold text-gray-700" for="ethnicity">
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
    <div class="mb-6">
      <label class="block mb-2 text-sm font-bold text-gray-700" for="feedback">
        Feedback
      </label>
      <input
        class="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        id="feedback"
        type="text"
        placeholder="Let the Experimenters know if you have any feedback!"
        bind:value={feedback}
      />
    </div>
    <div class="text-center">
      <Button type={"submit"} color={"blue"}>Submit</Button>
    </div>
  </form>
</div>

<div class="text-center">
  <h1 class="mb-4 text-2xl">Thanks for participating!</h1>
  <p>Use the reset button in the footer to reset user data</p>
</div>
