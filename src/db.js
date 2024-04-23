const SequelizeAuto = require('sequelize-auto');
const sequelize = new SequelizeAuto('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'postgres',
    directory: './db',
});

sequelize.run((err) => {
    if (err) throw err;
    console.log('Модели успешно сгенерированы!');
});