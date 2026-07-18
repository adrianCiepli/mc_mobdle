import mobs from "./mobs.js";

const getDailyAnswer = (userTimeZone) => {
  const mobKeys = Object.keys(mobs);

  // Intl is internationalization object that is native, deals with stuff that depends on nation/location
  // Intl.DateTimeFormat() is a method that returns an object with stored properties about how to interpret a Date object
  //    when given no params, it will return the object with the params filled in with the executing device's internal defaults (the executors timeZone, location, ...)
  // Date() object is essentially just a numeric value of milliseconds since some day in UTC
  // We can pass the Date object into the formatter given it's values, and it will interpret that given the localization it was set to, to give a timezone's date in some format
  // You can take the Intl.DateTimeFormat() object and call .resolvedOption() on it, which returns and object of all of the formatter's properties with values
  // This will include things you did not specify that had default values found for them
  // You can do Intl.DateTimeFormat().resolvedOptions() to get the object of all the default DateTime option on the executor's machine, so use .timeZone to extract user timezone
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: userTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // en-CA formats as YYYY-MM-DD, so we can split directly on "-", Number is a function (str) => int(str), it just casts
  const [year, month, day] = formatter.format(now).split("-").map(Number);

  // Combines date into single num
  const dateSeed = (year * 10000) + (month * 100) + day;

  // Slightly complicated formula to make it feel more random if you know about mobs.js, can change 1013 to a different prime at will
  const dailyIndex = ((dateSeed * 1013) + 47) % mobKeys.length;

  const dailyMobKey = mobKeys[dailyIndex];

  const ans = { name: dailyMobKey, ...mobs[dailyMobKey] };
  return ans;
}

export default getDailyAnswer;