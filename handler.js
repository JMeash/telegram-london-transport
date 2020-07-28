require('dotenv').config();

const { Telegraf } = require('telegraf');
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

module.exports.ltbot = async event => {
    let body = event.body[0] === '{' ? JSON.parse(event.body) : JSON.parse(Buffer.from(event.body, 'base64'));
    const bot = new Telegraf(TELEGRAM_TOKEN);

    await bot.start((ctx) => ctx.reply('Hello'));
    await bot.help((ctx) => ctx.reply('Ask me for the status of a tube line'));
    await bot.hears('Hi', (ctx) => ctx.reply('Hey there'));

    await bot.handleUpdate(body);
    return {statusCode: 200, body: ''};
}