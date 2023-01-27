const rwClient = require("./twitterClient.js");

const deleteTweets = () => {
  console.log("deleting...");
  try {
    const tweetIdsToDelete = [
      // string of tweet ids to delete
      "1618923742939484160",
      "1618924524594135042"
    ];

    tweetIdsToDelete.forEach(async (tweetId) => {
      await rwClient.v2.deleteTweet(tweetId);
      console.log(tweetId, " deleted.");
    });
  } catch (error) {
    console.log(error);
  }
};

deleteTweets();
