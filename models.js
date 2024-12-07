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
    password_hash: {
        type: DataTypes.STRING(120),
        allowNull: false,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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

const Session = sequelize.define('Session', {
    sid: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    sess: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    expire: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'session',
    timestamps: false
});

const Courses = sequelize.define('Course', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    }, 
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }, 
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'courses',
    timestamps: false,
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

module.exports = {
    Users,
    Session,
    Courses,
}