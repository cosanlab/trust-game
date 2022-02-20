<script>
  // Simple styled reusable button component
  export let color = "purple";
  let tailwindColor, tailwindHover;
  if (color === "purple") {
    tailwindColor = "bg-violet-500";
    tailwindHover = "hover:bg-violet-700";
  } else if (color === "blue") {
    tailwindColor = "bg-blue-500";
    tailwindHover = "hover:bg-blue-700";
  }
  export let type = "button";
</script>

<button
  class="px-4 py-2 font-bold text-white rounded focus:outline-none hover:cursor-pointer
{tailwindColor} {tailwindHover}"
  on:click
  {type}
>
  <slot>add text here</slot>
</button>
