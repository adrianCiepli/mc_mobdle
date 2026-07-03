import mobs from "./mobs.js";

// TODO: Account for user's personal time so that each user from different timezone can get new answer at 12:00
// OR: Have a countdown on the website to when there will be a new answer so that they know, and then can use UTC
// Ensure that in whichever case, GuessArea.jsx uses time as well to check for localStorage clearing, so update accordingly there

const getDailyAnswer = () => {
  const mobKeys = Object.keys(mobs);

  // Generate a stable date based on Eastern Time (Ontario), not UTC.
  // Intl.DateTimeFormat with timeZone handles the EST/EDT daylight-saving
  // switch automatically, so we don't have to hardcode a fixed UTC offset.
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // en-CA formats as YYYY-MM-DD, so we can split directly on "-", Number is a function (str) => int(str), it just casts
  const [year, month, day] = formatter.format(now).split("-").map(Number);

  // Combines date into single num
  const dateSeed = (year * 10000) + (month * 100) + day;

  // Slightly complicated formula to make it feel more random if you know about mobs.js, can change 1013 to a different prime at will
  const dailyIndex = ((dateSeed * 1013) + 47) % totalMobs;

  const dailyMobKey = mobKeys[dailyIndex];

  const ans = { name: dailyMobKey, ...mobs[dailyMobKey] };
  return ans;
}

export default getDailyAnswer;