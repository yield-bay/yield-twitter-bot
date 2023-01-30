require("process");

const {
  getToday,
  getTweetText,
  getReplyText,
  tweeter,
  fetchData,
} = require("./utils");

let farms_apr, farms_score, farms_tvl;
let tweet_text_tvl, reply_text_tvl;
let tweet_text_apr, reply_text_apr;
let tweet_text_score, reply_text_score;

// Final function that uploads media and sends tweet requests
const tweet = async () => {
  console.log("tweeting...");

  await tweeter("tvl", tweet_text_tvl, reply_text_tvl);
  await tweeter("yield", tweet_text_apr, reply_text_apr);
  await tweeter("score", tweet_text_score, reply_text_score);
};

const main = async () => {
  // Data of all tracked farms
  let farms = await fetchData();
  farms_tvl = await farms.slice(0, 3);

  farms.sort(function (a, b) {
    return b.safetyScore - a.safetyScore;
  });
  farms_score = await farms.slice(0, 3);

  farms.sort(function (a, b) {
    return b.apr.reward + b.apr.base - a.apr.reward - a.apr.base;
  });
  farms_apr = await farms.slice(0, 3);

  // Today's date in "dd mm" format
  const str_today = getToday();

  // Main tweet string formation
  tweet_text_tvl = `GM Sailors 🌊\n\nHighest TVL Farms on list.yieldbay.io (${str_today})  ↓\n\n${getTweetText(
    farms_tvl,
    "tvl"
  )}`;

  tweet_text_apr = `Want to maximise your yields?\n\nFarms with highest yields listed on list.yieldbay.io (${str_today})  ↓\n\n${getTweetText(
    farms_apr,
    "apr"
  )}`;

  tweet_text_score = `Here are the highest ranked yield farming opportunities on list.yieldbay.io (${str_today})  ↓\n\n${getTweetText(
    farms_score,
    "score"
  )}`;

  // Reply tweet with farms
  reply_text_tvl = getReplyText(farms_tvl);
  reply_text_apr = getReplyText(farms_apr);
  reply_text_score = getReplyText(farms_score);

  //Call tweet
  await tweet();
};

main().then(() => process.exit());
