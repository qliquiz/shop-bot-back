const express = require('express');
const cors = require('cors');
const bot = require('./bot');
const app = express();

app.use(express.json());
app.use(cors());

// Обработка транзакции в приложении
app.post('/web-data', async (req, res) => {
    const {queryId, products = [], totalPrice} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка!',
            input_message_content: {
                message_text: `Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products.map(item => item.title).join(', ')}`
            }
        })
        return res.status(200).json({});
    } catch (e) {
        return res.status(500).json({});
    }
});

const PORT = 3000;

app.listen(PORT, () => console.log('\n' + 'Server started on PORT ' + PORT + '\n'));