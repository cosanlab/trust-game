<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  let count = 0;

  // This function is called whenever we click the button
  // It increments the value of the javascript varialbe "count" each time it runs.
  // It also checks if the count is 5 and lets ahy parent component know by emitting
  // an event called 'big-number'
  function increment() {
    count += 1;
    if (count === 5) {
      dispatch("big-number");
    }
  }

  // Similar to the previous function but runs when we click the refresh icon
  // It resets the "count" variable to 0 and emits a "reset" event to any parent
  function reset() {
    count = 0;
    dispatch("reset");
  }
</script>

<style>
  /* We can declar styles in the <style> section using tailwind's @apply directive*/
  /* Or we can declare them using class='something' on the HTML elements directly */
  button {
    @apply py-4 px-8 text-red-500 border-2 rounded-full border-red-100 hover:border-red-500 active:bg-red-100;
  }
  svg {
    @apply w-6 h-6 text-red-300 cursor-pointer stroke-current hover:text-red-500;
  }
</style>

<!-- Only the <button> gets it's styles from the <style> section -->
<!-- Everything else has styles applied using class='something'-->
<!-- @apply is handy when repeating styles across a lot of elements, .e.g -->
<!-- multiple buttons. Otherwise they function the same-->
<div class="flex items-center justify-center space-x-2">
  <div>
    <button on:click={increment}>
      Clicks: {count}
    </button>
  </div>

  <div class="reset" on:click={reset}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  </div>
</div>
