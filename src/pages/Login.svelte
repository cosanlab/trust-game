<script>
  import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
  } from "firebase/auth";

  import { userStore, userId } from "../utils";

  let password, loginError;
  $: email = `${$userId}@experiment.com`;

  async function login() {
    // For development the username and password is just test-user
    // Get the current auth status
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        console.log("no participant found...creating new account");
        await createUserWithEmailAndPassword(auth, email, password);
        await initUser($userId);
      } else {
        loginError = error.code;
        console.error(error);
      }
    }
  }
</script>

<div class="w-full max-w-xs">
  <form
    class="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md"
    on:submit|preventDefault={login}
  >
    <div class="mb-4">
      <label class="block mb-2 text-sm font-bold text-gray-700" for="username">
        User ID
      </label>
      <input
        class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        id="username"
        type="text"
        placeholder="Username"
        bind:value={$userId}
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
        placeholder="******************"
        bind:value={password}
      />
      {#if loginError}
        <p class="text-xs italic text-red-500">{loginError}</p>
      {/if}
    </div>
    <div class="text-center">
      <button
        class="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
        type="submit"
      >
        Login
      </button>
    </div>
  </form>
</div>
