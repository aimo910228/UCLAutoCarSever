// for mqtt subscribe

const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://163.18.26.106', { username: "flask", password: "flask" });

client.on('connect', function () {
    try {
        const location = "ucl/uwb";
        client.subscribe(location, function (err) {
            if (!err) {
                console.log("subscribe topic:" + location)
            }
        });
        const info = "/ucl/battery"
        client.subscribe(info, function (err) {
            if (!err) {
                console.log("subscribe topic:" + info)
            }
        });
    } catch (err) {
        console.log("MQTT 訂閱失敗");
        console.log("err:", err);
    }
});

client.on('message', (topic, message) => {
    try {
        msg = message.toString();
        console.log("topic: " + topic, " msg: ", msg)

        switch (topic) {
            case 'ucl/uwb':
                console.log('call locAPI')
                AddLocaltionAPI(msg)
                break
            case '/ucl/battery':
                console.log('call infoAPI')
                AddInfoAPI(msg)
                break

        }
        console.log('No handler for topic %s', topic)
    } catch (err) {
        console.log("MQTT 消息接收失敗")
        console.log("err:", err)
    }
})

var request = require('request')

var Api_Url = "https://uclautocar.54ucl.com";
function AddLocaltionAPI(mqtt_content) {
    let reqbody = {
        rawData: mqtt_content,
    }
    console.log("reqbody:" + reqbody)
    request.post({
        headers: { 'content-type': 'application/json' },
        url: Api_Url + '/addcarloc',
        body: reqbody,
        json: true
    }, function (error, response, body) {
        console.error('error:', error, "error End"); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
    })
}

function AddInfoAPI(mqtt_content) {
    let reqbody = {
        rawData: mqtt_content,
    }
    console.log("reqbody:" + reqbody)
    request.post({
        headers: { 'content-type': 'application/json' },
        url: Api_Url + '/addcarinfo',
        body: reqbody,
        json: true
    }, function (error, response, body) {
        console.error('error:', error, "error End");
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);
    })
}