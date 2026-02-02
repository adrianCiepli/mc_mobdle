const express = require("express");
const app = express();



// Should come last after defining needed routes and handling
app.listen(3000, () => {
    console.log("The server is running...")
})