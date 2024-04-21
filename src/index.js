const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '7006446181:AAFtpbQW4f2JXNLalFNuvWyVGKUiqgGES90';
const webAppUrl = 'https://colonochka.netlify.app';

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start') {
        await bot.sendMessage(chatId, 'Привет! Добро пожаловать в наш магазин Колоночка!');

        await bot.sendMessage(chatId, 'Внизу появится кнопка, пожалуйста, заполните форму регистрации.', {
            reply_markup: {
                keyboard: [
                    [{text: 'Заполнить форму', web_app: {url: webAppUrl + '/form'}, resize_keyboard: 'true'}]
                ]
            }
        });

        await bot.sendMessage(chatId, 'Просмотрите наш каталог по кнопке ниже или напишите, какую модель вы хотите.\
        Так же я могу проконсультировать Вас и подобрать подходящий товар.', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Открыть каталог', web_app: {url: webAppUrl}}]
                ]
            }
        });
    }

    if(msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)
            console.log(data)

            await bot.sendMessage(chatId,
                `Запомнил!\nВаши данные:\nСтрана - ${data?.country}\nГород - ${data?.city}\nПочтовое отделение - ${data?.street}`, {
                reply_markup: {
                    remove_keyboard: true
                }
            });
        } catch (e) {
            console.log(e);
        }
    }
});

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
})

const PORT = 3000;

app.listen(PORT, () => console.log('Server started on PORT ' + PORT));