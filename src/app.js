const express = require('express');
const cors = require('cors');
const bot = require('./bot');
const app = express();

app.use(express.json());
app.use(cors());

// Обработка транзакции в приложении
app.post('/web-data', async (req, res) => {
    const {queryId, products = [], totalPrice} = req.body;
    console.log(req.body);
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка!',
            input_message_content: {
                message_text: `Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products.map((item) => {
                    const dbPath = '/Users/artemgorev/data_base_pluto.bd';
                    const sqlite3 = require('sqlite3');
                    const db = new sqlite3.Database(dbPath);
                    try {
                        db.run(`UPDATE users SET coins = (coins + 1) WHERE username = ?`, [data.friend_username], (err) => {
                            if (err) console.error(err.message);
                            else console.log(`Значение Coins для пользователя ${data.friend_username} успешно увеличено на 1.`);
                        });
                    } catch (err) {
                        console.error('Ошибка при работе с базой данных:', err.message);
                    }
                    finally {
                        db.close((err) => {
                            if (err) console.error(err);
                            else console.log('\n' + 'Соединение с базой данных закрыто.' + '\n');
                        });
                    }
                    return item.title
                }).join(', ')}`
            }
        })
        return res.status(200).json({});
    } catch (e) {
        return res.status(500).json({});
    }
});

const PORT = 3000;

app.listen(PORT, () => console.log('\n' + 'Server started on PORT ' + PORT + '\n'));