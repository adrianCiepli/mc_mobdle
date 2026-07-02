const express = require("express");
const app = express();

const mobs = require("./mobs.js")



// Should come last after defining needed routes and handling
app.listen(3000, () => {
    console.log("The server is running...")
})