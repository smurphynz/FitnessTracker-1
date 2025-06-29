const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
process.env.NODE_ENV = "production";
app.get("/", (req, res) => res.send("<h1>Deployment Works!</h1><p>Port: " + PORT + "</p>"));
app.listen(PORT, () => console.log("Server on port " + PORT));
