require("isomorphic-fetch");
require("process");

const rwClient = require("./twitterClient.js");
const { formatFloat, toDollar, getToday, farmUrl } = require("./utils");

let farms_apr, farms_safety, farms_tvl;
let tweet_text_tvl, reply_text_tvl;
let tweet_text_apr, reply_text_apr;
let tweet_text_score, reply_text_score;

// Final function that uploads media and sends tweet requests
const tweet = async () => {
  console.log("tweeting...");
  try {
    const mediaID_tvl = await rwClient.v1.uploadMedia("assets/tvl.png");
    const mediaID_apr = await rwClient.v1.uploadMedia("assets/yield.png");
    const mediaID_safety = await rwClient.v1.uploadMedia("assets/safety.png");

    // Top TVL Farms
    const { data: tweet_tvl } = await rwClient.v2.tweet({
      text: tweet_text_tvl,
      media: { media_ids: [mediaID_tvl] },
    });
    await rwClient.v2.reply(reply_text_tvl, tweet_tvl.id);

    // Top APR Farms
    const { data: tweet_apr } = await rwClient.v2.tweet({
      text: tweet_text_apr,
      media: { media_ids: [mediaID_apr] },
    });
    await rwClient.v2.reply(reply_text_apr, tweet_apr.id);

    // Top Safety Farms
    const { data: tweet_score } = await rwClient.v2.tweet({
      text: tweet_text_score,
      media: { media_ids: [mediaID_safety] },
    });
    await rwClient.v2.reply(reply_text_score, tweet_score.id);
  } catch (e) {
    console.error(e);
  }
};

const main = async () => {
  console.log("fetching api...");
  const data = await (
    await fetch(process.env.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          {
            farms {
              id
              chain
              tvl
              protocol
              asset {
                symbol
                address
              }
              safetyScore
              apr {
                base
                reward
              }
            }
          }`,
      }),
    })
  ).json();

  let farms = data.data.farms;

  farms_tvl = await farms.slice(0, 3);

  farms.sort(function (a, b) {
    return b.safetyScore - a.safetyScore;
  });
  farms_safety = await farms.slice(0, 3);

  farms.sort(function (a, b) {
    return b.apr.reward + b.apr.base - a.apr.reward - a.apr.base;
  });
  farms_apr = await farms.slice(0, 3);

  // Today's date in "dd mm" format
  str_today = getToday();

  // Main tweet string formation
  tweet_text_tvl = `GM Sailors 🌊\n\nHighest TVL Farms on list.yieldbay.io (${str_today})  ↓\n\n→ ${
    farms_tvl[0].protocol.charAt(0).toUpperCase() +
    farms_tvl[0].protocol.slice(1)
  } on ${
    farms_tvl[0].chain.charAt(0).toUpperCase() + farms_tvl[0].chain.slice(1)
  } : ${farms_tvl[0].asset.symbol}  -  ${toDollar(farms_tvl[0].tvl)}\n→ ${
    farms_tvl[1].protocol.charAt(0).toUpperCase() +
    farms_tvl[1].protocol.slice(1)
  } on ${
    farms_tvl[1].chain.charAt(0).toUpperCase() + farms_tvl[1].chain.slice(1)
  } : ${farms_tvl[1].asset.symbol}  -  ${toDollar(farms_tvl[1].tvl)}\n→ ${
    farms_tvl[2].protocol.charAt(0).toUpperCase() +
    farms_tvl[2].protocol.slice(1)
  } on ${
    farms_tvl[2].chain.charAt(0).toUpperCase() + farms_tvl[2].chain.slice(1)
  } : ${farms_tvl[2].asset.symbol}  -  ${toDollar(farms_tvl[2].tvl)}`;

  tweet_text_apr = `Want to maximise your yields?\n\nFarms with highest yields listed on list.yieldbay.io (${str_today})  ↓\n\n→ ${
    farms_apr[0].protocol.charAt(0).toUpperCase() +
    farms_apr[0].protocol.slice(1)
  } on ${
    farms_apr[0].chain.charAt(0).toUpperCase() + farms_apr[0].chain.slice(1)
  } : ${farms_apr[0].asset.symbol}  -  ${formatFloat(
    farms_apr[0].apr.reward + farms_apr[0].apr.base
  )}%\n→ ${
    farms_apr[1].protocol.charAt(0).toUpperCase() +
    farms_apr[1].protocol.slice(1)
  } on ${
    farms_apr[1].chain.charAt(0).toUpperCase() + farms_apr[1].chain.slice(1)
  } : ${farms_apr[1].asset.symbol}  -  ${formatFloat(
    farms_apr[1].apr.reward + farms_apr[1].apr.base
  )}%\n→ ${
    farms_apr[2].protocol.charAt(0).toUpperCase() +
    farms_apr[2].protocol.slice(1)
  } on ${
    farms_apr[2].chain.charAt(0).toUpperCase() + farms_apr[2].chain.slice(1)
  } : ${farms_apr[2].asset.symbol}  -  ${formatFloat(
    farms_apr[2].apr.reward + farms_apr[2].apr.base
  )}%`;

  tweet_text_score = `Here are the highest ranked yield farming opportunities on list.yieldbay.io (${str_today})  ↓\n\n→ ${
    farms_safety[0].protocol.charAt(0).toUpperCase() +
    farms_safety[0].protocol.slice(1)
  } on ${
    farms_safety[0].chain.charAt(0).toUpperCase() +
    farms_safety[0].chain.slice(1)
  } : ${farms_safety[0].asset.symbol}  -  ${formatFloat(
    farms_safety[0].safetyScore * 10
  )}/10\n→ ${
    farms_safety[1].protocol.charAt(0).toUpperCase() +
    farms_safety[1].protocol.slice(1)
  } on ${
    farms_safety[1].chain.charAt(0).toUpperCase() +
    farms_safety[1].chain.slice(1)
  } : ${farms_safety[1].asset.symbol}  -  ${formatFloat(
    farms_safety[1].safetyScore * 10
  )}/10\n→ ${
    farms_safety[2].protocol.charAt(0).toUpperCase() +
    farms_safety[2].protocol.slice(1)
  } on ${
    farms_safety[2].chain.charAt(0).toUpperCase() +
    farms_safety[2].chain.slice(1)
  } : ${farms_safety[2].asset.symbol}  -  ${formatFloat(
    farms_safety[2].safetyScore * 10
  )}/10`;

  // Reply tweet with farms
  reply_text_tvl = `Here you can find more about these farms ↓\n\n→ ${
    farms_tvl[0].asset.symbol
  }  - ${farmUrl(farms_tvl[0])}\n→ ${farms_tvl[1].asset.symbol}  -  ${farmUrl(
    farms_tvl[1]
  )}\n→ ${farms_tvl[2].asset.symbol}  -  ${farmUrl(farms_tvl[2])}`;

  reply_text_apr = `Here you can find more about these farms ↓\n\n→ ${
    farms_apr[0].asset.symbol
  }  - ${farmUrl(farms_apr[0])}\n→ ${farms_apr[1].asset.symbol}  -  ${farmUrl(
    farms_apr[1]
  )}\n→ ${farms_apr[2].asset.symbol}  -  ${farmUrl(farms_apr[2])}`;
  
  reply_text_score = `Here you can find more about these farms ↓\n\n→ ${
    farms_safety[0].asset.symbol
  }  - ${farmUrl(farms_safety[0])}\n→ ${farms_safety[1].asset.symbol}  -  ${farmUrl(
    farms_safety[1]
  )}\n→ ${farms_safety[2].asset.symbol}  -  ${farmUrl(farms_safety[2])}`;

  //Call tweet
  await tweet();
};

main().then(() => process.exit());
