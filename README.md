# YieldBay Twitter Bot

## Description
Twitter bot that tweets the following whenever it's triggered - 
1. Top 3 farms by TVL on [YieldBay List](https://list.yieldbay.io).
2. Top 3 farms by safety score on [YieldBay List](https://list.yieldbay.io).
3. Top 3 farms by yield on [YieldBay List](https://list.yieldbay.io).

## How to run?
1. Setup a [Twitter Developers](https://developer.twitter.com/) account.
2. Generate the necessary credentials from your Twitter Developers dashboard.
3. Create a .env file and populate it with the Twitter credentials.
```
APP_KEY=<your_twitter_app_key>
APP_SECRET=<your_twitter_app_secret>
ACCESS_TOKEN=<your_twitter_access_token>
ACCESS_SECRET=<your_twitter_access_secret>
```
4. Install the dependencies.
```yarn```
5. Run the script
```node index.js```


## Setup tips
We at YieldBay run it as a cron job at a specific time everyday. You can configure it as a cron job to run as often as you want. This could also be morphed into an on-demand Telegram Bot to poll the data. 
