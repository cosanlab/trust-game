# Svelte Template Starter

This is a svelte template designed for bootstrapping small applications used in social and affective science. It's been setup to use the latest development tooling to make coding the app a fast and fun experience.

It's also designed to use TailwindCSS for styling and Firebase for data-storage and possibly application state storage.

## Quick Start

1. `npx degit https://github.com/ejolly/create-svelte-experiment.git yourAppName`
2. `cd yourAppName`
3. `npm install`
4. [Setup your firebase project](#setup-firebase)
4. `npm run dev` and navigate to `localhost:3000` in your browser


## Setup Firebase

*Firebase setup here*  
*Add firebase config to app here*

## Deploying

- To create a production build of the app and see what it'll be like when deployed to a hosting service or your own server, run:  
`npm run build`  
- You can then run the app using `npm run serve` and it will appear just like it would if deployed live

*Add Netlify instructions here*


---
---
## Original setup steps

*These just provide a record of how this repo was setup from scratch. There's no need to redo these steps manually!*

1. Bootstrap the app scaffold using Vite:  
```
# Use the Vite app scaffold creator
# Make sure to choose the svelte option during setup

npm init vite@latest
```

2. Setup TailwindCSS:  
```
# Install tailwind and its dependencies

npm install -D tailwindcss@latest postcss@latest autoprefixer@latest

# Create a tailwind configuration file
# This will create a tailwind.config.js and postcss.config.js file in the project

npx tailwind init -p

# Edit those config files with the content in this repo
# to make them handle svelte files and directives properly
# also enables Tailwind's new super fast an customizable JIT mode

```

3. Create and copy in the contents of `svelte.config.js`  
This tells `.svelte` to treat all `<style>` tags as `<style lang='postcss'>` which properly understands Tailwind directives like `@apply` and variants like `hover:bg-red-500`

4. Create `Tailwind.svelte` with the contents in this project and import it into `App.svelte`  
This actually makes tailwind styles *globally* available throughout the app