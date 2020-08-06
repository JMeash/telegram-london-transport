const config = require('./config');
const { Telegraf } = require('telegraf');
const { requestLineStatus } = require("./lib/tflRequester.ts");
const { statusWriter } = require("./lib/helpers.ts");

module.exports.ltbot = async event => {
    let body = event.body[0] === '{' ? JSON.parse(event.body) : JSON.parse(Buffer.from(event.body, 'base64'));
    const bot = new Telegraf(config.telegram.token);

    bot.start((ctx) => {
        return ctx.reply('Hello')
    });
    bot.help((ctx) => {
        return ctx.reply('Ask me for the status of a tube line')
    });


    bot.hears(/How is [A-z]+\?$/, async (ctx) => {
        try{
            const result = await requestLineStatus(ctx.message.text.slice(7, -1));
            return ctx.reply(statusWriter(result));
        } catch (e) {
            return ctx.reply(`There was an error: ${e.message}`)
        }

    });
    // bot.command('/ask')

    await bot.handleUpdate(body);
    return {statusCode: 200};
}