const fs = require('fs');
const https = require('https');
const express = require('express');
const cors = require('cors');
const mqtt_publish = require("./sever");
const path = require("path");
var bodyParser = require('body-parser');


const hostname = 'uclautocar.54ucl.com';
const httpsport = 443;

const cert = fs.readFileSync('./ssl/sever.pem');
const key = fs.readFileSync('./ssl/private.key');

const httpsoptions = {
    cert: cert,
    key: key
};

const app = express();
const httpsServer = https.createServer(httpsoptions, app);

app.use(cors());

app.use(express.static("./build"));

app.get("*", (req, res) => {
    res.sendFile(
        path.join(__dirname, "build/index.html")
    );
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/mqtt", function (req, res) {
    try {
        console.log(req.body.topic & req.body.message);
        mqtt_publish.mqtt_publish(req.body.topic, req.body.message);
        res.json("OK");
    } catch (error) {
        console.log(error);
    }
});

app.post("/submqtt", function (req, res) {
    try {
        console.log(req.body.topic);
        res.json(mqtt_publish.mqtt_publish(req.body.topic));
    } catch (error) {
    console.log(error);
}
});


httpsServer.listen(httpsport, hostname);

console.log('RUN https://uclautocar.54ucl.com/')
