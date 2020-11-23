const {Sequelize, Model, DataTypes} = require('sequelize');
const db = new Sequelize('sqlite:main.db');

class BroadcastLog extends Model {
}

BroadcastLog.init({
    id: {type: DataTypes.STRING, primaryKey: true},
    videoUrl: DataTypes.STRING,
    web_url: DataTypes.STRING,
    text: DataTypes.STRING,
    createTime: DataTypes.DATE,
    chat_id: DataTypes.BIGINT,
    message_id: DataTypes.INTEGER,
}, {timestamps: false, sequelize: db, modelName: 'BroadcastLog'});

module.exports = {
    db,
    BroadcastLog
}