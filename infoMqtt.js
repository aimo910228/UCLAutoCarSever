
function carInfo() {
    // 引入 sequelize 套件
    const { Sequelize } = require('sequelize');

    // 透過 new 建立 Sequelize 這個 class，而 sequelize 就是物件 instance
    const sequelize = new Sequelize(
        'demo', 'ucl_yl', 'ucl_YL',
        { host: '163.18.26.149', dialect: 'mysql' }
    );

    const CarInfoView = sequelize.define(
        // 定義 Model 名字
        'carInfo_view',
        // 定義 Model 屬性
        {
            "id": {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            "rawData": {
                type: Sequelize.STRING,
                // allowNull defaults to true
            },
            "timeStep": {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            }
        },
        // 定義 Model 其他選項
        {
            modelName: 'carInfo_view',
            freezeTableName: true,
            timestamps: false,
        }
    );

    return new Promise((resolve, reject) => {
        const whitch_info = require('./info')

        sequelize.sync().then(() => {
            CarInfoView.findAll({
                order: [["id", "DESC"]], limit: 1,
            }).then((cars) => {
                let mytime = cars[0].timeStep;
                let myinfo = cars[0].rawData;
                whitch_info.whitch_info(JSON.parse(myinfo)).then((val) => {
                    resolve({ "Status": "Ok", "val": val, "time": mytime })
                });
            }).catch((err) => {
                console.log("Find_Data查詢失敗")
                console.log("err:", err)
                reject({ "Status": "Failed" })
            });
        });
    })
}

module.exports.carInfo = carInfo;