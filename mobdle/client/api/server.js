// Don't need Express since we're dealing with Vercel serverless backend functions which do the stuff that Express does as a persistent separate server platform (deployment)
// for us, like figuring out the URL to the server we're using for our backend, figuring out the port for all our app's api requests, and all the other stuff express does
// Vercel does this for us as long as we have our ./api folder with our functions inside files, where the file names and the path from the root, like ./api/my-function get
// automatically made and within each file is a Node.js handler function that does the stuff, and the frontend sends the requests to those URLs, so it looks like internal
// communication but actually it's built on top of AWS which is even a whole different kind of server from one that just is a common endpoint for user browsers to fetch
// a frontend from, since these need to execute functions and stuff, so physically there are different servers being used for frontend and backend.

// We are going to handle user guesses by having only the backend know the answer, and user guesses get sent to the backend for comparison, then result sent back to frontend


// const express = require("express");
// const app = express();

// const mobs = require("./mobs.js")



// // Should come last after defining needed routes and handling
// app.listen(3000, () => {
//     console.log("The server is running...")
// })