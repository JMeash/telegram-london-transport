const config = require('./config');
const { Telegraf } = require('telegraf');

import { requestLineStatus } from './lib/tflRequester';
import { statusWriter } from './lib/helpers';

module.exports.ltbot = async event => {
    let body = JSON.parse(event.body);
    const bot = new Telegraf(config.telegram.token);

    bot.start((ctx) => {
        return ctx.reply('Hello')
    });
    bot.help((ctx) => {
        return ctx.reply('Ask me for the status of a tube line')
    });


    bot.hears(/^How is (.+)\?$/, async (ctx) => {
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