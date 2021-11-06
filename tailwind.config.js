module.exports = {
  // Comment out mode: 'jit' to disabe Tailwind's new JIT mode
  // It's currently a preview feature but is much faster and 
  // enables all variants by default, e.g. disabled:opacity-75
  // add allows for custom on-the-fly classes, e.g. w-[10px]
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{svelte,js,ts}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      // Example of extending active to work with background color because
      // tailwind doesnt enable all states to work with all css properties by
      // default e.g. active:bg-red-100
      // ONLY NEEDED IF NOT USING JIT MODE ABOVE!
      // backgroundColor: ['active'],
    },
  },
  plugins: [],
}