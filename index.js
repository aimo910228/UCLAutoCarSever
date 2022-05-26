// 引入 cors 套件
const cors = require('cors');
// 引入 sequelize 套件
const { Sequelize } = require('sequelize');
// 引入 mqtt_publish 函式
const mqtt_publish = require("./sever");
// 引入 fs 套件
const fs = require('fs');

const https = require('https');


const path = require("path");


// 透過 new 建立 Sequelize 這個 class，而 sequelize 就是物件 instance
const sequelize = new Sequelize('test', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql'
});

// 定義一個叫做 User 的資料結構
const User = sequelize.define(
    // 定義 Model 名字
    'User',
    // 定義 Model 屬性
    {
        firstName: {
            // 欄位名稱
            type: Sequelize.STRING,
            //  資料型態
            allowNull: true
            // 能不能為空，預設是 true
        },
        lastName: {
            type: Sequelize.STRING
            // allowNull defaults to true
        }
    },
    // 定義 Model 其他選項
    {}
);

const hostname = "uclautocar.54ucl.com";
const httpsPort = 8443;

// const cert = fs.readFileSync('./ssl/certificate.crt');
// const ca = fs.readFileSync('./ssl/certificate.crt');

const cert = fs.readFileSync('./ssl/sever.pem');
const key = fs.readFileSync('./ssl/private.key');

let options = {
    cert: cert,
    // ca: ca, 
    key: key
};

// also okay: https.createServer({cert, ca, key}, (req, res) => { ...
const httpsServer = https.createServer(options, (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end("<h1>HTTPS server running</h1>");
});

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080; // check running enviroment
app.use(cors());

app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
    res.sendFile(
        path.join(__dirname, "build/index.html")
    );
});

app.post("/mqtt", function (req, res) {
    try {
        // console.log(typeof req.body.message); // string
        console.log(req.body.message);
        mqtt_publish.mqtt_publish(req.body.message);
        res.json("OK");
    } catch (error) {
        console.log(error);
    }
});

httpsServer.listen(httpsPort, hostname);

app.listen(port);