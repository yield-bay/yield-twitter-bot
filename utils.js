require("isomorphic-fetch");
require("process");

const rwClient = require("./twitterClient.js");

function formatFloat(value) {
  return parseFloat(value).toFixed(2);
}

function toDollar(num) {
  if (num >= 1000000) {
    return "$" + (num / 1000000).toFixed(2) + "M";
  } else if (num >= 1000 && num < 1000000) {
    return "$" + (num / 1000).toFixed(2) + "K";
  }
  return "$" + num.toString();
}

function getToday() {
  var today = new Date();
  var dd = today.getDate();
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let mm = month[today.getMonth()];
  return dd + " " + mm;
}

function farmUrl(farm) {
  const utmLink =
    "&utm_campaign=yieldbay-bot&utm_source=twitter&utm_medium=textlink";
  return `https://list.yieldbay.io/farm/${farm.id}/?addr=${farm.asset.address}${utmLink}`.replace(
    " ",
    "%20"
  );
}

function getTweetText(farms, type) {
  let text = "";
  for (let i = 0; i < 3; i++) {
    text += `→ ${
      farms[i].protocol.charAt(0).toUpperCase() + farms[i].protocol.slice(1)
    } on ${
      farms[i].chain.charAt(0).toUpperCase() + farms[i].chain.slice(1)
    } : ${farms[i].asset.symbol}  -  `;
    if (type == "tvl") {
      text += `${toDollar(farms[i].tvl)}\n`;
    } else if (type == "apr") {
      text += `${formatFloat(farms[i].apr.reward + farms[i].apr.base)}%\n`;
    } else {
      text += `${formatFloat(farms[i].safetyScore * 10)}/10\n`;
    }
  }
  return text;
}

function getReplyText(farms) {
  let text = "Here you can find more about these farms ↓\n\n";
  for (let i = 0; i < 3; i++) {
    text += `→ ${farms[i].asset.symbol}  - ${farmUrl(farms[i])}\n`;
  }
  return text;
}

async function tweeter(media, tweet_text, reply_text) {
  try {
    const mediaID = await rwClient.v1.uploadMedia(`assets/${media}.png`);
    const { data: tweet } = await rwClient.v2.tweet({
      text: tweet_text,
      media: { media_ids: [mediaID] },
    });
    await rwClient.v2.reply(reply_text, tweet.id);
  } catch (e) {
    console.error(e);
  }
}

async function fetchData() {
  console.log("fetching api...");
  console.log(process.env.API_URL);
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
  return farms;
}

module.exports = {
  formatFloat,
  toDollar,
  getToday,
  farmUrl,
  getTweetText,
  getReplyText,
  tweeter,
  fetchData,
};
