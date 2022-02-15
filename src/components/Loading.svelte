<!-- We can use this as both a loading screen and a waiting for other participants
screen. In other pages if we just do <Loading/> it'll display the default value of text
below, otherise we can pass in a custom text by doing <Loading text={'my message'}/> -->
<script>
  export let text = "Loading...";
</script>

<div class="grid h-screen grid-rows-6 place-items-center">
  <div
    class="w-32 h-32 row-start-3 border-4 border-gray-400 border-solid rounded-full animate-spin border-t-transparent"
  />
  <div class="row-start-4 text-center">
    <h1 class="text-4xl">{text}</h1>
  </div>
</div>
