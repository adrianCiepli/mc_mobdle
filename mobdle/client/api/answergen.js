import mobs from "./mobs.js";

const getDailyAnswer = () => {
  const mobKeys = Object.keys(mobs);

  // Generate a stable timestamp based strictly on UTC midnight boundaries
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1; // Months are 0-indexed
  const day = now.getUTCDate();
  
  // Combines date into single num
  const dateSeed = (year * 10000) + (month * 100) + day;

  // Map date to an answer's index
  const dailyIndex = dateSeed % mobKeys.length;

  const dailyMobKey = mobKeys[dailyIndex];

  const ans = { name: dailyMobKey, ...mobs[dailyMobKey] };

  return ans;
}

export default getDailyAnswer;