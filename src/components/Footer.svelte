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
    @apply flex justify-around text-center text-white fixed left-0 bottom-0 w-[100vw] p-2 font-bold;
  }
</style>

<div
  class="banner"
  class:bg-red-600={import.meta.env.DEV}
  class:bg-gray-600={!import.meta.env.DEV}
>
  <div>If you have questions please ask the experimenter</div>
  <div>
    <button
      class="px-4 py-1 text-xs font-bold bg-blue-500 rounded"
      class:invisible={!$loggedIn}
      on:click={logout}>logout</button
    >
    {#if import.meta.env.DEV}
      <button
        class="px-4 py-1 text-xs font-bold bg-green-600 rounded"
        class:invisible={!$loggedIn}
        on:click={() => dispatch("resetGroup")}>Reset Group</button
      >
    {/if}
    <div />
  </div>
</div>
