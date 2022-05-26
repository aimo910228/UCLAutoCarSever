const db = require('./config/db');


const cors = require('cors');


// 引入 sequelize 套件
const { Sequelize } = require('sequelize');

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
        firstName: { // 欄位名稱
            type: Sequelize.STRING,  //  資料型態
            allowNull: true // 能不能為空，預設是 true
        },
        lastName: {
            type: Sequelize.STRING
            // allowNull defaults to true
        }
    },
    // 定義 Model 其他選項
    {}
);

// //選取
// sequelize.sync().then(() => {
//     User.findAll().then(users => { //資料表名稱
//         // 用 JSON.stringify() 來格式化輸出
//         console.log("All users:", JSON.stringify(users, null, 4));
//         //onsole.log(users[0]);
//         //console.log(users[0].id, users[0].firstName);
//     });
// });

// //新增
// sequelize.sync().then(() => {
//     // 寫入對映欄位名稱的資料內容
//     User.create({
//         // 記得 value 字串要加上引號
//         firstName: 'Heidi',
//         lastName: 'Liu'
//     }).then(() => {
//         // 執行成功後會印出文字
//         console.log('successfully created!!')
//     });
// });

// //選取
// sequelize.sync().then(() => {
//     User.findAll().then(users => {
//         // 用 JSON.stringify() 來格式化輸出
//         console.log("All users:", JSON.stringify(users, null, 4));
//         //onsole.log(users[0]);
//         //console.log(users[0].id, users[0].firstName);
//     });
// });

// //搜尋
// sequelize.sync().then(() => {
//     User.findOne({
//         where: {
//             id: '1'
//         }
//     }).then(user => {
//         console.log(user.firstName);
//     });
// });

// sequelize.sync().then(() => {
//     User.findAll({
//         where: {
//             firstName: 'Apple'
//         }
//     }).then(users => {
//         console.log(users[0].id, users[0].firstName);
//     });
// });

// sequelize.sync().then(() => {
//     User.findOne({
//         where: {
//             id: '1'
//         }
//     }).then(user => {
//         console.log(user.firstName);
//     });
// });
// Heidi

// //修改，找單一改
// sequelize.sync().then(() => {
//     User.findOne({
//         where: {
//             id: '1'
//         }
//     }).then(user => {
//         // 在 () 裡面用 {} 大括號包住要更新的內容
//         user.update({
//             lastName: 'Banana'
//         });
//     }).then(() => {
//         console.log('update done!');
//     });
// });

// //刪除
// sequelize.sync().then(() => {
//     User.findOne({
//         where: {
//             id: '2'
//         }
//     }).then(user => {
//         user.destroy().then(() => {
//             console.log('destroy done!');
//         });
//     });
// });

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080; // check running enviroment
app.use(cors());

app.get('/', function (req, res) {
    sequelize.sync().then(() => {
        //選取
        User.findAll().then(users => {
            // 用 res.json 來輸出
            res.json(users);
        });
    });
});

app.get('/create', function (req, res) {
    sequelize.sync().then(() => {
        //新增
        User.create({
            // 在 () 裡面用 {} 大括號包住要新增的內容
            firstName: req.query.firstName,
            lastName: req.query.lastName
        }).then(() => {
            // 執行成功後會印出文字
            res.json('Successfully created! Please back to index.')
        });
    });
});

app.get('/delete', function (req, res) {
    //刪除
    sequelize.sync().then(() => {
        //找單一刪 => id
        User.findOne({
            where: { id: req.query.id }
        }).then(user => {
            user.destroy().then(() => {
                // 執行成功後會印出文字
                res.json('destroy done! Please back to index.');
            });
        });
    });
});

app.get('/edit', function (req, res) {
    //修改
    sequelize.sync().then(() => {
        //找單一改 => id
        User.findOne({
            where: { id: req.query.id }
        }).then(user => {
            res.json(user);
        });
    });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/createP', function (req, res) {
    sequelize.sync().then(() => {
        //新增
        User.create({
            // 在 () 裡面用 {} 大括號包住要新增的內容
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }).then(() => {
            // 執行成功後會印出文字
            req.json('Successfully created! Please back to index.')
        });
    });
});

app.post('/deleteP', function (req, res) {
    //刪除
    sequelize.sync().then(() => {
        //找單一刪 => id
        User.findOne({
            where: { id: req.body.id }
        }).then(user => {
            user.destroy().then(() => {
                // 執行成功後會印出文字
                res.json('destroy done! Please back to index.');
            });
        });
    });
});

app.post('/editP', function (req, res) {
    //修改
    console.log('find')
    sequelize.sync().then(() => {
        //找單一改 => id
        User.findOne({
            where: { id: req.body.id }
        }).then(user => {
            res.json(user);
        });
    });
});

app.post("/signin", function (req, res) {
    const { username, password } = req.body;
    db.query(
        `SELECT * FROM account WHERE username='${username}' AND password='${password}'`,
        function (err, rows, fields) {
            if (rows.length === 0) {
                return res.send({ error: 'ACCOUNT_NOT_EXIST' });
            };
            return res.send({ message: 'LOGIN_SUCCESSFULLY' });
        }
    );
});

app.listen(port);

if (port === 8080) {
    console.log('RUN http://localhost:8080/')
}