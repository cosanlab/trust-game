<script>
  import { onAuthStateChanged } from "firebase/auth";
  import { doc, onSnapshot } from "firebase/firestore";
  import { onMount } from "svelte";
  import {
    auth,
    db,
    userStore,
    groupStore,
    loggedIn,
    userId,
    initUser,
    updateUser,
    updateGroup,
    serverTime,
    createTestGroup,
  } from "./utils.js";

  // app pages and components
  import Login from "./pages/Login.svelte";
  import Instructions from "./pages/Instructions.svelte";
  import Pre_Questions from "./pages/BPQ.svelte";
  import Delivery from "./pages/Delivery.svelte";
  import Post_Questions from "./pages/APQ.svelte";
  import Debrief from "./pages/Debrief.svelte";
  import Loading from "./components/Loading.svelte";
  import Footer from "./components/Footer.svelte";

  // VARIABLES USED WITHIN App.svelte
  let unsubscribe_user, unsubscribe_group;

  // FUNCTIONS USED WITHIN App.svelte

  // Update the experiment state and write to firebase
  async function updateState(newState) {
    const oldState = $groupStore.currentState;
    try {
      console.log(`Participant: ${$userId} is requesting state -> ${newState}`);
      // Add the user to the counter if they're not already in it
      if (!$groupStore.counter.includes($userStore.userId)) {
        $groupStore.counter = [...$groupStore.counter, $userStore.userId];
        await updateGroup($groupStore);
      } else {
        console.log("Ignoring duplicate request");
      }
      if ($groupStore.counter.length === 3) {
        $groupStore.currentState = newState;
        $groupStore.counter = [];
        console.log(`Last request...initiating state change`);
        await updateGroup($groupStore);
      } else {
        console.log(
          `Still waiting for ${3 - $groupStore.counter.length} requests...`
        );
      }

      // TODO: Keeping these here for now, but we may not need it anymore. In fact I'm
      // wondering if we can actually just get rid of the participants collection and
      // $userStore altogether...

      // $userStore.currentState = newState;
      // try {
      //   $userStore[`${oldState}_end`] = serverTime;
      //   $userStore[`${$userStore.currentState}_start`] = serverTime;
      //   await updateUser($userStore);
    } catch (error) {
      console.error(error);
    }
  }

  // Reset a user's data. Useful during development
  async function resetUser() {
    console.log("Reinitializing user data");
    await initUser(
      $userStore.groupId,
      $userStore.subId,
      $userStore.role,
      $userStore.name
    );
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
        if (unsubscribe_user) {
          unsubscribe_user();
        }
        if (unsubscribe_group) {
          unsubscribe_group();
        }
      } else {
        // Set the userId store to the value on their local computer because if they're
        // logging in for the first time, then Login.svelte would have already done
        // localStore.setItem()
        // Otherwise if they're already logged in and just refreshing the page, they
        // won't see Login.svelte at all so we *have* read their userId from their
        // computer.
        $userId = localStorage.getItem("userId");
        $loggedIn = true;
        console.log(`participant ${$userId} signed-in. Loading data...`);
        try {
          // Subscribe to their user doc
          unsubscribe_user = onSnapshot(
            doc(db, "participants", $userId),
            (doc) => {
              userStore.set(doc.data());
            }
          );
          // Also subscribe to their group doc
          unsubscribe_group = onSnapshot(
            doc(db, "groups", $userId.slice(0, 3)),
            (doc) => {
              groupStore.set(doc.data());
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
  {#if !$loggedIn}
    <Login />
  {:else if !$groupStore || !$groupStore.currentState}
    <Loading />
  {:else if $groupStore.currentState === "instructions"}
    <Instructions on:to-pre_questions={() => updateState("pre_questions")} />
  {:else if $groupStore.currentState === "pre_questions"}
    <Pre_Questions on:to-delivery={() => updateState("delivery")} />
  {:else if $groupStore.currentState === "delivery"}
    <Delivery on:to-post_questions={() => updateState("post_questions")} />
  {:else if $groupStore.currentState === "post_questions"}
    <Post_Questions on:to-debrief={() => updateState("debrief")} />
  {:else if $groupStore.currentState === "debrief"}
    <Debrief />
  {/if}
</main>
<Footer on:resetUser={resetUser} on:resetGroup={createTestGroup} />
