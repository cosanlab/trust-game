# Trust Game Demo


This is a webapp that runs a mock interactive Trust Game between 2 people. It's built using:
- [SvelteJS](https://svelte.dev/) as an intuitive javascript framework for layout and logic
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Firebase](https://firebase.google.com/) for server-less data storage (and real-time updates)
- [Netlify](https://www.netlify.com/) for automatic deploying and hosting from github


## Trial Phase schematic

1. Investor receives endowment and makes decision; Trustee sees endowment make prediction rating.
2. Investor makes 1st order expectation rating; Trustee make prediction rating and 2nd order expectation rating
3. Trustee makes decision
4. Both see trial outcome
5. Both rate how guilty they feel given partner's expectation as well as give counterfactual guilt rating
6. Fixation


### One time CORS configuration

In order to actually make any stored/static files (i.e. mp3s, videos, etc) accessible by the app you must set the [CORS access policy](https://cloud.google.com/storage/docs/configuring-cors) on google cloud:

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
