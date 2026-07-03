import mobs from "./mobs.js";

// Future logic may need to account for user local time, probably via having a useEffect() on mount in App.jsx that sends the user time zone to the server

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

  // Map date to an answer's index
  const dailyIndex = dateSeed % mobKeys.length;

  const dailyMobKey = mobKeys[dailyIndex];

  const ans = { name: dailyMobKey, ...mobs[dailyMobKey] };
  return ans;
}

export default getDailyAnswer;