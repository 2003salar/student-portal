const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_STRING)
const Users = sequelize.define('User', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    dob: {
        type: DataTypes.DATE(),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(120),
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
}, {
    tableName: 'users',
    timestamps: true,
    indexes: [{
        unique: true,
        fields: ['email']
    }]
});


const asyncDB = async() => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({alter: true});
        console.log('Tables created');
    } catch (error) {
        console.log(error);
    }
}
asyncDB()

module.exports = Users