const TelegramBot = require('node-telegram-bot-api');
const dialogflow = require('@google-cloud/dialogflow');

const TOKEN = '7006446181:AAFtpbQW4f2JXNLalFNuvWyVGKUiqgGES90';
const WEB_APP_URL = 'https://colonochka.netlify.app';
const PROJECT_ID = 'agentnullnull7-iise';

const credentials = require('../goo.json');
const sessionClient = new dialogflow.SessionsClient({ credentials });

const bot = new TelegramBot(TOKEN, {polling: true});


// Обработка сообщения в боте
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (typeof text !== 'string') {
        bot.sendMessage(chatId, 'Извините, я пока понимаю только текст.');
        return;
    }

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

    // В ход идёт Dialogflow
    try {
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
            try {
                const responses = await sessionClient.detectIntent(request);
                const result = responses[0].queryResult;
                const responseText = result.fulfillmentText;
        
                bot.sendMessage(chatId, responseText);
            } catch (error) {
                console.error('Response', error);
                bot.sendMessage(chatId, 'Произошла Response ошибка.');
            }
        } catch (error) {
            console.log('Request', error);
            bot.sendMessage(chatId, 'Произошла Request ошибка.');
        }
    } catch (error) {
        console.log('SessionPath', error);
        bot.sendMessage(chatId, 'Произошла SessionPath ошибка.');
    }
});