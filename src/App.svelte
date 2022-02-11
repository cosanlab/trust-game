<script>
  import { onAuthStateChanged } from "firebase/auth";
  import { doc, onSnapshot } from "firebase/firestore";
  import { onMount } from "svelte";
  import {
    auth,
    db,
    userStore,
    loggedIn,
    userId,
    initUser,
    updateUser,
    serverTime,
  } from "./utils.js";

  // app pages and components
  import Login from "./pages/Login.svelte";
  import Consent from "./pages/Consent.svelte";
  import Experiment from "./pages/Experiment.svelte";
  import Debrief from "./pages/Debrief.svelte";
  import Loading from "./components/Loading.svelte";
  import Footer from "./components/Footer.svelte";

  // VARIABLES USED WITHIN App.svelte
  let unsubscribe;

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

  // When the app first starts up we check to see if the user is logged in and if they
  // aren't we set the value of the $loggedIn svelte store to false which takes them to
  // the <Login/> page. We also unsubscribe to any data we were already subscribed to.
  // Because onAuthStateChange() is *always* watching to see if their login status
  // changes, when they sign-in from the <Login/> page, we'll automatically be in the
  // else block below. Here we set the value of the $loggedIn svelte store to true and
  // subscribe to their data
  onMount(async () => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        $loggedIn = false;
        if (unsubscribe) {
          unsubscribe();
        }
      } else {
        console.log("participant signed-in. Loading data...");
        $loggedIn = true;
        try {
          unsubscribe = onSnapshot(doc(db, "participants", $userId), (doc) => {
            userStore.set(doc.data());
          });
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
  {#if !$loggedIn}
    <Login />
  {:else if !$userStore.currentState}
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
