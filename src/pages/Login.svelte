<script>
  import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
  } from "firebase/auth";

  import { userStore, initUser, userId, formatUserId } from "../utils";
  import Button from "../components/Button.svelte";

  let name, subId, role, loginError;
  const groupId = 0;
  const password = "cosanlab";

  // Sets SID based on role
  function setSubId() {
    if (role === "investor") {
      subId = 0;
    } else {
      subId = 1;
    }
  }

  async function login() {
    setSubId();
    const auth = getAuth();
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
  }
</script>

<style>
  li {
    @apply mr-4 text-xl;
  }
  ul {
    @apply flex mb-2;
  }
</style>

<div class="w-full max-w-md mb-6">
  <form
    class="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md"
    on:submit|preventDefault={login}
  >
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
        <option value="investor">Investor</option>
        <option value="trustee">Trustee</option>
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
    <div class="text-center">
      <Button type={"submit"} color={"blue"}>Login</Button>
    </div>
  </form>
</div>
