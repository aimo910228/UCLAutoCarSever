const { Sequelize } = require('sequelize');

class connect {
    render() {
        // 透過 new 建立 Sequelize 這個 class，而 sequelize 就是物件 instance
        const sequelize = new Sequelize('test', 'root', '', {
            host: '127.0.0.1',
            dialect: 'mysql'
        });
        return sequelize;
    }
}
export default connect;