<script>
  import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
  } from "firebase/auth";
  import { doc, onSnapshot } from "firebase/firestore";
  import { onMount } from "svelte";
  import {
    auth,
    db,
    userStore,
    initUser,
    updateUser,
    serverTime,
  } from "./utils.js";

  // app pages and components
  import Consent from "./pages/Consent.svelte";
  import Experiment from "./pages/Experiment.svelte";
  import Debrief from "./pages/Debrief.svelte";
  import Loading from "./components/Loading.svelte";
  import Footer from "./components/Footer.svelte";

  // VARIABLES USED WITHIN App.svelte
  let email, userId, password;

  if (import.meta.env.DEV) {
    // for local development
    email = "test-user@experiment.com";
    userId = "test-user";
    password = "test-user";
  } else {
    // when deployed, change me!
    email = "test-user@experiment.com";
    userId = "test-user";
    password = "test-user";
  }

  // FUNCTIONS USED WITHIN App.svelte

  // Update the user state and write to firebase
  async function updateState(newState) {
    const oldState = $userStore.currentState;
    $userStore.currentState = newState;
    try {
      $userStore[`${oldState}_end`] = serverTime;
      $userStore[`${$userStore.currentState}_start`] = serverTime;
      await updateUser($userStore);
    } catch (error) {
      console.error(error);
    }
  }

  // Reset a user's data. Useful during development
  async function resetUser() {
    console.log("Reinitializing user data");
    await initUser($userStore.userId);
  }

  // Logic to try to sign a user in automatically and subscribe to their data
  // or create a new user account if one doesn't exist
  onMount(async () => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
          if (error.code === "auth/user-not-found") {
            console.log("no participant found...creating new account");
            await createUserWithEmailAndPassword(auth, email, password);
            await initUser(userId);
          } else {
            console.error(error);
          }
        }
      } else {
        console.log("participant signed-in. Loading data...");
        try {
          const unsubscribe = onSnapshot(
            doc(db, "participants", userId),
            (doc) => {
              userStore.set(doc.data());
            }
          );
        } catch (error) {
          console.error(error);
        }
      }
    });
  });
</script>

<!-- This is our main markup. It uses the currentState field of the userStore to
determine what page a user should be on. -->
<main class="flex flex-col items-center h-screen p-10 space-y-10">
  {#if !$userStore.currentState}
    <Loading />
  {:else if $userStore.currentState === "consent"}
    <Consent on:to-experiment={() => updateState("experiment")} />
  {:else if $userStore.currentState === "experiment"}
    <Experiment on:to-debrief={() => updateState("debrief")} />
  {:else if $userStore.currentState === "debrief"}
    <Debrief />
  {/if}
</main>
<Footer on:resetUser={resetUser} />
