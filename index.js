const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });
const port = process.env.PORT || 3000;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/weather.html");
});

app.post("/", function (req, res) {
  const query = req.body.cityName;
  const apiKey = process.env.API_KEY;
  const unit = "metric";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${unit}`;

  https.get(url, function (response) {
    console.log(response.statusCode);

    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weathDes = weatherData.weather[0].description;

      res.write(
        "<h1>the tempertaure in " +
          query +
          " is " +
          temp +
          " degree celsius</h1>"
      );
      res.write(
        "<p>weather description of the current location is " + weathDes + "<p>"
      );
      res.send();
    });
  });
});

app.listen(port, function () {
  console.log(`server started on port ${port}`);
});
