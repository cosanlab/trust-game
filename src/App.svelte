<script>
  import logo from "./assets/svelte.png";
  import Counter from "./components/Counter.svelte";
  import Tailwind from "./components/Tailwind.svelte";
  import { scale } from "svelte/transition";

  let logoVisible = false;

  function showLogo() {
    logoVisible = true;
  }
  function hideLogo() {
    logoVisible = false;
  }
</script>

<!-- Make tailwind available throughout app -->
<Tailwind />
<!-- This is our main markup -->
<main class="flex flex-col items-center p-10 space-y-10">
  <div class="w-1/2 text-center">
    <h1 class="text-red-500 text-8xl">Hello World!</h1>
  </div>

  <!-- Here we import a "child" component that draws a button and reset icon -->
  <!-- It also emits 2 events 'big-number' and 'reset' which will call the 'showLogo'
  and 'hideLogo' functions respectively -->
  <Counter on:big-number={showLogo} on:reset={hideLogo} />

  <p>
    Visit
    <a
      href="https://svelte.dev"
      class="text-red-500 hover:underline hover:text-blue-500"
    >
      svelte.dev
    </a>
    to learn how to build Svelte apps.
  </p>
  <!-- We can use the value of the javascript variable 'logoVisible' to dynamically hide
or show this image -->
  <!-- We also use a transition directive which allows us to do some simple animations
when it appears or disappears -->
  {#if logoVisible}
    <img
      src={logo}
      alt="Svelte Logo"
      class="w-1/4"
      transition:scale={{ duration: 700 }}
    />
  {/if}
</main>
