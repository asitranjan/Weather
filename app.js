//jshint esversion:6

const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
// 1st phase: get the data through frontend
app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html");
});

// 2nd phase: fetch the data from other server and
// process in your own server then send the result.
app.post("/",function(req,res){
    var zipCode = req.body.cityName;
    var unit = "metric";
    var appKey = "e5d52796be1f6eca2e719b7a1516291e";
    var url = "https://api.openweathermap.org/data/2.5/weather?zip=" + zipCode +",IN" + "&units=" + unit + "&appid=" + appKey;

    https.get(url, function(response){
        response.on("data",function(data){
          const weatherdata = JSON.parse(data);
          const temp = weatherdata.main.temp;
          const description = weatherdata.weather[0].description;
          const icon = weatherdata.weather[0].icon;
          const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
          const city = weatherdata.name;
          res.write("<h1>Temperature of " + city + " is " + temp + " deg Celcious. </h1>");
          res.write('<h3>The weather is currently ' + description + '</h3>');
          res.write("<img src ="+ imageURL + ">");
          res.send();
        });
      });
});


// });

app.listen(process.env.PORT || 2000,function(){
  console.log("Server is running on port 2000.");
});
