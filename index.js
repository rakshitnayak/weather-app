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

  https
    .get(url, function (response) {
      let rawData = "";

      response.on("data", function (chunk) {
        rawData += chunk;
      });

      response.on("end", function () {
        try {
          const weatherData = JSON.parse(rawData);

          if (response.statusCode === 404) {
            return res.status(response.statusCode).send(
              `<h1>${
                weatherData?.message || "Server Busy :(, Please try later"
              }</h1>
              <span>Try Again or different City</span><a href="/">here</a>
              `
            );
          } else if (response.statusCode !== 200) {
            return res
              .status(response.statusCode)
              .send(`<h1>Error: ${weatherData.message}</h1>`);
          }

          const temp = weatherData.main.temp;
          const weathDes = weatherData.weather[0].description;

          res.write(
            `<h1>The temperature in ${query} is ${temp} degree celsius</h1>`
          );
          res.write(`<p>Weather description: ${weathDes}</p>`);
          res.send();
        } catch (error) {
          res.status(500).send("<h1>Internal Server Error</h1>");
        }
      });
    })
    .on("error", function (error) {
      res
        .status(500)
        .send("<h1>Failed to connect to the weather service.</h1>");
    });
});

app.listen(port, function () {
  console.log(`server started on port ${port}`);
});
