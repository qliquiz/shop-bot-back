const TelegramBot = require('node-telegram-bot-api');
const Dialogflow = require('dialogflow');

const token = '7006446181:AAFtpbQW4f2JXNLalFNuvWyVGKUiqgGES90';
const webAppUrl = 'https://colonochka.netlify.app';
// Dialogflow configuration
/* const projectId = 'YOUR_DIALOGFLOW_PROJECT_ID';
const sessionId = 'YOUR_SESSION_ID';
const languageCode = 'ru';
const sessionClient = new Dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(projectId, sessionId); */

const bot = new TelegramBot(token, {polling: true});


// Обработка сообщения в боте
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // Приветствие
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
    /* const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: text,
                languageCode: languageCode,
            },
        },
    };

    try {
        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;
        const responseText = result.fulfillmentText;

        bot.sendMessage(chatId, responseText);
    } catch (error) {
        console.error('Error:', error);
        bot.sendMessage(chatId, 'Произошла ошибка.');
    } */
});