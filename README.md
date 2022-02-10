# Create Svelte Experiment

*Last updated: 2022-01-24*

This is a svelte template designed for bootstrapping small applications used in social and affective science. It's been setup to use the latest development tooling to make coding the app a fast and fun experience. This includes:
- [SvelteJS](https://svelte.dev/) as an intuitive javascript framework for layout and logic
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Firebase](https://firebase.google.com/) for server-less data storage (and real-time updates)
- [Netlify](https://www.netlify.com/) for automatic deploying and hosting from github

See the [how the app works](#2-how-the-app-works) section below for more details and specifically the [code layout](#2a-code-layout-and-development) section for working with the template.

## 1. Quick Start

1. `git clone https://github.com/ejolly/create-svelte-experiment.git yourAppName`
2. `cd yourAppName`
3. `npm install`
4. [One time Firebase project setup](#1a-one-time-firebase-setup)
5. Make your first commit and push to a new github repo
6. [One time Netlify hosting setup](#1b-one-time-netlify-setup)
7. [One time CORS configuration](#1c-one-time-cors-configuration)
8. `npm run dev` and navigate to `localhost:3000` in your browser
9. Any new pushes to github will automatically be reflected in your live app hosted on Netlify


### 1a. One time Firebase setup

1. Go to [firebase console](https://console.firebase.google.com/) and create a new project
2. Don't enable google analytics (unless you really need to)
3. Authentication > enable Email/Password sign-in provider
4. Firestore Database > create database in *production* mode and choose closest geographical server location
5. Firestore Database > Rules > Change line 5 to only allow authenticated reads and writes:
   `allow read, write: if request.auth.uid != null`
6. Firestore Databse > Data > Create a new collection called `participants` and add a document with dummy data 
7. Delete the dummy document by clicking the *rightmost* 3-vertical dots. You should now have an empty collection called `participants`
8. Project Overview > Add web-app (name it whatever, **dont** add Firebase hosting)
9. Copy and paste the Firebase configuration into `src/utils.js`
10. [Configure CORS](#configure-cors)

### 1b. One time Netlify setup

1. Sign-in to [Netlify](https://netlify.app/) using your github account
2. Choose add new site and select your github repo
3. Change the *publish directory* to `dist`
4. Click the site settings button and change the site name to something you'll remember
5. Back in [firebase console](https://console.firebase.google.com/) go to Authentication > Sign-in method and click the Add domain button and paste in the site name (without a trailing `/` or `https` prefix)

### 1c. One time CORS configuration

In order to actually make any stored files (i.e. mp3s, videos, etc) accessible by the app you must set the [CORS access policy](https://cloud.google.com/storage/docs/configuring-cors) on google cloud:

1. Download [gsutil](https://cloud.google.com/storage/docs/gsutil_install) 
2. Unzip it, `cd` into the unzipped folder, and run: `install.sh`
3. Then run `gcloud init` and login with the same google account you used to create your firebase project
4. Create a file called `cors.json` that contains the following:
  ```
    [
      {
        "origin": ["*"],
        "method": ["GET"],
        "maxAgeSeconds": 3600
      }
    ]
  ```
  5. Find your google storage URL which should be something like `gs://yourproject.appspot.com`
  6. Run `gsutil cors set cors.json yourURL` 

## 2. How the App Works

Once the app is built and deployed, only the `public` folder gets served from Netlify, which contains a "skeleton" HTML file that gets filled in using the compiled Javascript in `bundle.js` along with the styles in `bundle.css.`

When a user first visits the deployed app, the javascript logic is executed in a "hierarchical" fashion with `App.svelte` treated as the "entry-point" or parent-most *component*. This component includes logic to determine what child components (e.g. `pages/`) should be rendered in the app. Therefore you should place additional such pages within the `pages/` sub-directory and any UI elements you plan to reuse across pages in the `components/` sub-directory

### 2a. Code layout and development

Most of the coding you'll do will take place within the `src/` folder. Create new svelte files in `src/pages` for different "pages" or states in your experiment the user will experience. Create new svelte files in `src/components` for components that you plan to use across multiple pages. Add javascript functions you plan to reuse across the app into `src/utils.js`. You can also use this file as a place to define *global variables* that can be access throughout the app. 

The scaffold also has a few special variables made available by [Vite](https://vitejs.dev/guide/env-and-mode.html#env-variables) that can be useful during development. In particular using `import.meta.env.DEV` can be useful to conditionally run code during development vs when the app is deployed live. You can see an example of this in `src/components/Footer.svelte`.

### 2b. Data and state management

All data for each user is stored within a Firebase collection called `'participants'` with a separate document per user. Each user document is both used to store data generated during the experiment itself (i.e. responses to trials or questions) as well as additional app *state* information for a specific user. State information may include things like *where* in the experiment the user currently is (e.g. consent, debrief, etc) or what trial of an experiment they're currently on. 

The benefit of storing this *state* information alongside a user's responses is that the app can make use of Firestore's *real-time data subscription*. The general pattern employed throughout the app is subscribing to the most up-to-date version of a user's document and saving it to a Svelte store called `userStore` from within `App.svelte`. This initial subscription is setup when a user first navigates to the app. Elsewhere in the app, new data is then written to Firebase using the `updateUser` function in `utils.js`. This ensures that pages and components are guaranteed to *automatically* have the "freshest" user data as long as they read from the Svelte store (i.e. `$userStore.someField`) rather than querying the database directly.

By referencing the `currentState` field in the `userStore`, `App.svelte` will determine what *page* a user should be seeing from within `pages/` *automatically* thereby showing the correct content to the user. Because the app is serverless, it's good practice to write any values that you want to persist across page refreshes to the database. 

For additional details on how to specifically use this app scaffold with Amazon's Mturk see [this project instead](https://github.com/ejolly/thought_tagger#how-the-app-behaves-when-navigated-to).

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