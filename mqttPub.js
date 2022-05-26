function mqtt_publish(topic, msg) {
    const mqtt = require('mqtt')
    try {
        const client = mqtt.connect('mqtt://163.18.26.106', { username: "flask", password: "flask" })
        client.on('connect', function () {
            client.publish(topic, msg);
            client.end()
        })

        client.on('message', function (topic, message) {
            client.end()
            console.log("message ")
        })

    } catch (error) {
        console.log("Not connected")
        console.log(error)
    }
}

module.exports.mqtt_publish = mqtt_publish;