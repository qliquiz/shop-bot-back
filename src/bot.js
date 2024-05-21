const TelegramBot = require('node-telegram-bot-api');
const dialogflow = require('@google-cloud/dialogflow');

const TELEGRAM_TOKEN = '7006446181:AAFtpbQW4f2JXNLalFNuvWyVGKUiqgGES90';
const WEB_APP_URL = 'https://colonochka.netlify.app';
const PROJECT_ID = 'agentnullnull7-iise';

const credentials = require('./goo.json');
const sessionClient = new dialogflow.SessionsClient({ credentials });

const bot = new TelegramBot(TELEGRAM_TOKEN, {polling: true});


// Обработка сообщения в боте
bot.on('message', async (msg) => {
    const userName = msg.from.username;
    const chatId = msg.chat.id;
    const text = msg.text;
    console.log(userName);

    // Приветствие
    if(text === '/start') {
        await bot.sendMessage(chatId, 'Привет! Добро пожаловать в наш магазин Колоночка!');

        await bot.sendMessage(chatId, 'Внизу появится кнопка, пожалуйста, заполните форму регистрации.', {
            reply_markup: {
                keyboard: [
                    [{text: 'Заполнить форму', web_app: {url: WEB_APP_URL + '/form'}, resize_keyboard: 'true'}]
                ]
            }
        });

        await bot.sendMessage(chatId, 'Просмотрите наш каталог по кнопке ниже или напишите, какую модель вы хотите. Так же я могу проконсультировать Вас и подобрать подходящий товар.', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Открыть каталог', web_app: {url: WEB_APP_URL}}]
                ]
            }
        });
    }

    // Обработка формы
    if(msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data);
            console.log(data);

            const dbPath = '/Users/artemgorev/data_base_pluto.bd';
            const sqlite3 = require('sqlite3');
            const db = new sqlite3.Database(dbPath);
            try {
                db.run(`INSERT INTO users (username, post_index, phone_number, customer_type, friend_username) VALUES (?, ?, ?, ?, ?)`, [userName, data.post_index, data.phone_number, data.customer_type, data.friend_username], (err) => {
                    if (err) console.error(err.message);
                    else console.log('Данные успешно вставлены в таблицу users.');
                });
    
                if (data.friend_username != "" && data.friend_username != userName) {
                    db.run(`UPDATE users SET coins = (coins + 1) WHERE username = ?`, [data.friend_username], (err) => {
                        if (err) console.error(err.message);
                        else console.log(`Значение Coins для пользователя ${data.friend_username} успешно увеличено на 1.`);
                    });
                }
            } catch (err) {
                console.error('Ошибка при работе с базой данных:', err.message);
            }
            finally {
                db.close((err) => {
                    if (err) console.error(err);
                    else console.log('\n' + 'Соединение с базой данных закрыто.' + '\n');
                });
            }

            await bot.sendMessage(chatId,
                `Запомнил!\nВаши данные:\nНомер телефона - ${data?.phone_number}\nПочтовый индекс - ${data?.post_index}\nВы - ${data?.customer_type}`, {
                reply_markup: {
                    remove_keyboard: true
                }
            });
        } catch (e) {
            console.log(e);
        }
    }


    // Dialogflow
    if (text != '/start' && typeof text == 'string') {
        const sessionPath = sessionClient.projectAgentSessionPath(String(PROJECT_ID), String(chatId));
        try {
            const request = {
                session: sessionPath,
                queryInput: {
                    text: {
                        text: text,
                        languageCode: 'ru',
                    },
                },
            };
            const responses = await sessionClient.detectIntent(request);
            const result = responses[0].queryResult;
            const responseText = result.fulfillmentText;

            bot.sendMessage(chatId, responseText);
        } catch (error) {
            console.log('Request or response', error);
            bot.sendMessage(chatId, 'Произошла request либо response ошибка.');
        }
    }
});