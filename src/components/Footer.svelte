<!-- This is the Footer component that contains contact info as well as a firebase
document reset button when developing locally to re-initialize a user document as if it
was just created -->
<script>
  import { getAuth, signOut } from "firebase/auth";
  import { createEventDispatcher } from "svelte";
  import { userStore, loggedIn, userId } from "../utils.js";
  const dispatch = createEventDispatcher();

  // Change to your email
  const email = "eshin.jolly@dartmouth.edu";

  async function logout() {
    // Get the current auth status
    const auth = getAuth();
    try {
      await signOut(auth);
      // Delete the user Id from their computer so a new user can sign-in
      localStorage.removeItem("userId");
      $userId = null;
      console.log("Sucessfully logged out of firebase");
    } catch (error) {
      console.error(error);
    }
  }
</script>

<style>
  .banner {
    @apply fixed left-0 bottom-0 w-[100vw] p-2 font-bold;
  }
</style>

<div
  class="flex justify-around text-white banner"
  class:bg-red-600={import.meta.env.DEV}
  class:bg-gray-600={!import.meta.env.DEV}
>
  {#if import.meta.env.DEV}
    <div>
      <p>
        Development mode
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="inline w-6 h-6 ml-1 hover:cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          on:click={() => dispatch("resetUser")}
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </p>
    </div>
  {/if}
  <div>If you have questions please ask the experimenter</div>
  <div>
    <button
      class="px-4 py-1 text-xs font-bold bg-blue-500 rounded-full"
      class:invisible={!$loggedIn}
      on:click={logout}>logout</button
    >
  </div>
</div>
