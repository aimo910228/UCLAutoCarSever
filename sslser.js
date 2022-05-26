const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const cors = require('cors');
const mqtt_publish = require("./mqttPub");
const path = require("path");
var bodyParser = require('body-parser');
const carLocation = require("./loc");
const carInfo = require("./infoMqtt");
const moment = require('moment')

const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('demo', 'ucl_yl', 'ucl_YL', {
    host: '163.18.26.149',
    dialect: 'mysql'
});

// 定義一個叫做 Car 的資料結構
const Car = sequelize.define(
    // 定義 Model 名字
    'demo_shop',
    // 定義 Model 屬性
    {
        "id": {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        "rawData": {
            type: Sequelize.STRING,
            defaultValue: "0",
            // allowNull defaults to true
        },
        "timeStep": {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        }
    },
    // 定義 Model 其他選項
    {
        modelName: 'demo_shop',
        freezeTableName: true,
        timestamps: false,
    });


// 定義一個叫做 Car 的資料結構
const InfoCar = sequelize.define(
    // 定義 Model 名字
    'car_info',
    // 定義 Model 屬性
    {
        "id": {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        "rawData": {
            type: Sequelize.STRING,
            defaultValue: "0",
            // allowNull defaults to true
        },
        "timeStep": {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        }
    },
    // 定義 Model 其他選項
    {
        modelName: 'car_info',
        freezeTableName: true,
        timestamps: false,
    });


const hostname = 'uclautocar.54ucl.com';
// const httpport = 8080;
const httpsport = 443;

const cert = fs.readFileSync('./ssl/sever.pem');
const key = fs.readFileSync('./ssl/private.key');

const httpsoptions = {
    cert: cert,
    // ca: ca, 
    key: key
};

const app = express();
// const httpServer = http.createServer(app);
const httpsServer = https.createServer(httpsoptions, app);


// app.use((req, res, next) => {
//     if (req.protocol === 'http') {
//         res.redirect(301, `https://${hostname}${req.url}`);
//     }
//     next();
// });

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
        // console.log(typeof req.body.message); // string
        console.log(req.body.topic & req.body.message);
        mqtt_publish.mqtt_publish(req.body.topic, req.body.message);
        res.json("OK");
    } catch (error) {
        console.log(error);
    }
});

app.post("/addcarloc", function (req, res) {
    var reqBody = req.body;
    sequelize.sync().then(() => {
        // 寫入對映欄位名稱的資料內容
        Car.create({
            // 記得 value 字串要加上引號
            timeStep: moment().format("YYYY-MM-DD HH:mm:ss"),
            rawData: reqBody.rawData,
        }).then(() => {
            // 執行成功後會印出文字
            res.send('successfully created!!');
        }).catch((err) => {
            console.log(err)
        });
    });
});

app.post("/addcarinfo", function (req, res) {
    var reqBody = req.body;
    sequelize.sync().then(() => {
        // 寫入對映欄位名稱的資料內容
        InfoCar.create({
            // 記得 value 字串要加上引號
            timeStep: moment().format("YYYY-MM-DD HH:mm:ss"),
            rawData: reqBody.rawData,
        }).then(() => {
            // 執行成功後會印出文字
            res.send('successfully created!!');
        }).catch((err) => {
            console.log(err)
        });
    });
});

app.post("/submqtt", function (req, res) {
    try {
        // console.log(typeof req.body.message); // string
        console.log(req.body.topic);
        // mqtt_publish.mqtt_publish(req.body.topic);
        res.json(mqtt_publish.mqtt_publish(req.body.topic));
    } catch (error) {
        console.log(error);
    }
});

app.post("/carlocate", function (req, res) {
    try {
        carLocation.carLocation().then((data) => {
            res.json(data)
        });
    } catch (error) {
        console.log(error);
    }
});

app.post("/carinfo", function (req, res) {
    try {
        carInfo.carInfo().then((data) => {
            res.json(data)
        });
    } catch (error) {
        console.log(error);
    }
});

// httpServer.listen(httpport, hostname);
httpsServer.listen(httpsport, hostname);

// console.log('RUN http://uclautocar.54ucl.com/')
console.log('RUN https://uclautocar.54ucl.com/')
