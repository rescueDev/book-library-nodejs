//Import
const mongodb = require("mongodb");
const mongoConnect = require("./utils/database").mongoConnect;
const express = require("express");

//create app instance
const app = express();

//set the view engine to ejs
app.set("view engine", ejs);

//connect instance mongodb
mongoConnect((client) => {
  console.log(client);
  app.listen(3000);
});
