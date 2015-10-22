#How to configure API keys

Queue Hero relies on four public APIs: Facebook, Yelp, Mapbox, and Twilio. You must register and obtain API keys for each service to run Queue Hero. Each service is available at:

[Yelp for Developers](https://www.yelp.com/developers)
[Facebook Developers](https://developers.facebook.com/)
[Developers | Mapbox](https://www.mapbox.com/developers/)
[Twilio](https://www.twilio.com/)

1. **Facebook:** Once registered, create a new website app. The client ID and Secret can be found at the default dashboard.
2. **Yelp:** Once registered, navigate to "Manage API Keys" to find your API keys.
3. **Mapbox:** Once registered, create a new project under the "Projects" tab which will generate a Map ID which looks like `username.ndi4ksk32`. The default public API token can be located under the "Projects" tab or under "Your Username" -> "Apps".
4. **Twilio:** [ INSERT TWILIO ]

###Running Queue Hero on localhost

1. Open `template_api_keys.js` located in `./server/config` and input the following information.

    * Facebook: Client Secret and Client ID
    * Yelp: Consumer Key, Consumer Secret, Token ID, and Token Secret
    * Twilio: Account SID, Auth Token, and a Sending Phone Number

2. Rename `template_api_keys.js` to `api_keys.js`. The `api_keys.js` file is in .gitignore to keep it private.
3. Go to Facebook developer website and navigate to "Settings" -> "Advanced". Set "Deauthorize Callback Url" at the top of the page to "http://localhost:3000/auth/facebook/callback".

![Facebook-Api](./resources/facebook-api-local-2.jpg =700x)
4. On the same page set "Valid OAuth redirect URIs" to also "http://localhost:3000/auth/facebook/callback"

![Facebook-Api-2](./resources/facebook-api-local-3.jpg =700x)
5. Navigate to `./client/src/shared/shared/mapbox/mapbox.js` and locate `mapbox.js`. Set `L.mapbox.accessToken` to your public API token. Set `L.mapbox.map` to include your Map ID.

    *Mapbox utilizes public API keys that are sent and visible to all users. The map feature will work without changing any configurations. However, we kindly request you register seperately and use your own API key*

![Mapbox-Api](./resources/mapbox-api.jpg =700x)
6. TWILIO INFORMATION

###Running Queue Hero on a Web Server/Heroku

1. The API keys must be set as an environment variable. DO NOT remove the `api-keys.js` from .gitignore and deploy, as your API keys will become public.
2. In heroku, the environment variable can be set via [CLI or under the "Settings" tab on Dashboard](https://devcenter.heroku.com/articles/config-vars).
3. Please see [this documentation](https://www.digitalocean.com/community/tutorials/how-to-read-and-set-environmental-and-shell-variables-on-a-linux-vps) at Digital Ocean on setting environment variables on your web server.
4. Go to Facebook developer website and navigate to "Settings" -> "Advanced". Set "Deauthorize Callback Url" at the top of the page to be `website-address.com/auth/facebook/callback`. For example in heroku the field should read "yourAppName.herokuapp.com/auth/facebook/callback".

![Facebook-Api](./resources/facebook-api-heroku-2.jpg =700x)
5. On the same page set "Valid OAuth redirect URIs" to also "website-address.com/auth/facebook/callback"

![Facebook-Api-2](./resources/facebook-api-heroku-3.jpg =700x)
6. Navigate to `./client/src/shared/shared/mapbox/mapbox.js` and locate `mapbox.js`. Set `L.mapbox.accessToken` to your public API token. Set `L.mapbox.map` to include your Map ID.

    *Mapbox utilizes public API keys that are sent and visible to all users. The map feature will work without changing any configurations. However, we kindly request you register seperately and use your own API key*

![Mapbox-Api](./resources/mapbox-api.jpg =700x)
7. TWILIO INFORMATION
