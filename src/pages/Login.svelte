<script>
  import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
  } from "firebase/auth";

  import { userStore, initUser, userId, formatUserId } from "../utils";
  import Button from "../components/Button.svelte";

  let name, groupId, subId, role, password, loginError;

  // HOW TO LOGIN
  // For testing purposes groupID is always: 0
  // For testing purposes subjectID is always: 0 or 1 or 2
  // For testing purposes choose decider 1 for subID 0, decider 2 for subID 1, and
  // receiver for subID 2
  // For testing purposes name is: Eshin for subID 0, Max for subID 1, and Luke for
  // subID 2
  // Correct password is always: cosanlab
  // We can just tell this to participants, but it stops random people on the internet
  // from trying to do the experiment

  function verifySubId() {
    let gid = parseInt(groupId);
    let sid = parseInt(subId);

    // For test groups skip verification
    if (gid === 0) return true;

    // For subIds < 3 make sure the role assignments are correct
    // groupId = 1, followed by 1, 2, 3 for D1, D2, R
    if (sid <= 3) {
      if (
        gid === 1 &&
        ((role === "decider1" && sid === 1) ||
          (role === "decider2" && sid === 2) ||
          (role === "receiver" && sid === 3))
      ) {
        return true;
      }
    }
    // For subIds > 3 make sure the role assignments are correct
    // D1's id should be divisible by 3 with a remainder of 1 e.g. sid = 4, 7, 10, etc
    // D2's id should be divisible by 3 with a remainder of 2 e.g. sid = 5, 8, 11, etc
    // R's id should be divisible by 3 with a remainder of 0 e.g. sid = 6, 9, 12, etc
    if (sid > 3) {
      if (
        (role === "decider1" && 3 % sid === 1) ||
        (role === "decider2" && 3 % sid === 2) ||
        (role === "receiver" && 3 % sid === 0)
      ) {
        return true;
      }
    }
    // Default is to fail verification
    return false;
  }

  async function login() {
    if (verifySubId()) {
      // Get the current auth status
      const auth = getAuth();
      if (password === "cosanlab") {
        // Convert their text input to NNN_NNN_role format
        let { groupId_f, subId_f, role_f, userId_f } = formatUserId(
          groupId,
          subId,
          role
        );
        let email = `${groupId_f}_${subId_f}_${role_f}@experiment.com`;
        // The unique userId for any specific participant is a concatentation of their
        // groupId_subjectId_role
        // To make it easy to use this else where in the app we can save it as a svelte
        // store called $userId. Then we can use that in App.svelte
        $userId = userId_f;
        // Also save this to the user's computer so that the app will auto-login them in
        // if they refresh the page, but don't press the logout button.
        localStorage.setItem("userId", $userId);
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
          if (error.code === "auth/user-not-found") {
            console.log("no participant found...creating new account");
            await createUserWithEmailAndPassword(auth, email, password);
            await signInWithEmailAndPassword(auth, email, password);
            await initUser(groupId_f, subId_f, role_f, name);
          } else {
            loginError = error.code;
            console.error(error);
          }
        }
      } else {
        loginError = "Incorrect password";
      }
    } else {
      loginError = "Incorrect Subject ID for selected Role";
    }
  }
</script>

<style>
  li {
    @apply mr-2;
  }
</style>

<div class="w-full max-w-md mb-6">
  <form
    class="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md"
    on:submit|preventDefault={login}
  >
    <div class="mb-4">
      <label class="block mb-2 text-sm font-bold text-gray-700" for="groupId">
        Group ID
      </label>
      <input
        class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        id="groupId"
        type="text"
        placeholder="Type the GROUP ID the experimenter gave you"
        bind:value={groupId}
      />
    </div>
    <div class="mb-4">
      <label class="block mb-2 text-sm font-bold text-gray-700" for="subId">
        Subject ID
      </label>
      <input
        class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        id="subId"
        type="text"
        placeholder="Type the SUBJECT ID the experimenter gave you"
        bind:value={subId}
      />
    </div>
    <div class="mb-4">
      <label for="roleId" class="mb-2 text-sm font-bold text-gray-700"
        >Role</label
      >
      <select
        id="roleId"
        name="roleId"
        bind:value={role}
        class="w-full px-3 py-2 leading-tight border rounded shadow focus:outline-none focus:shadow-outline"
      >
        <option value="">Select the ROLE the experimenter gave you</option>
        <option value="decider1">Decider 1</option>
        <option value="decider2">Decider 2</option>
        <option value="receiver">Receiver</option>
      </select>
    </div>
    <div class="mb-4">
      <label class="block mb-2 text-sm font-bold text-gray-700" for="name">
        Name
      </label>
      <input
        class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        id="name"
        type="text"
        placeholder="Type your first name"
        bind:value={name}
      />
    </div>
    <div class="mb-6">
      <label class="block mb-2 text-sm font-bold text-gray-700" for="password">
        Password
      </label>
      <input
        class="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        id="password"
        type="password"
        placeholder="Type the password the experimenter gave you"
        bind:value={password}
      />
      {#if loginError}
        <p class="text-xs italic text-red-500">{loginError}</p>
      {/if}
    </div>
    <div class="text-center">
      <Button type={"submit"} color={"blue"}>Login</Button>
    </div>
  </form>
</div>

<!-- Only show these instructions when we're developing locally -->
{#if import.meta.env.DEV}
  <div class="w-full max-w-md">
    <p>Use any of the following combinations to login:</p>
    <ul class="flex">
      <li>GroupID: 0</li>
      <li>SubId: 0</li>
      <li>Role: Decider 1</li>
      <li>name: Eshin</li>
    </ul>
    <ul class="flex">
      <li>GroupID: 0</li>
      <li>SubId: 1</li>
      <li>Role: Decider 2</li>
      <li>name: Max</li>
    </ul>
    <ul class="flex">
      <li>GroupID: 0</li>
      <li>SubId: 2</li>
      <li>Role: Receiver</li>
      <li>name: Luke</li>
    </ul>
  </div>
{/if}
