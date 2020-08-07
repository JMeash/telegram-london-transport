const config = require('./config');
const { Telegraf } = require('telegraf');
const extra = require('telegraf/extra');
const markup = extra.markdown();

import { requestLineStatus } from './lib/tflRequester';
import { statusWriter } from './lib/helpers';

module.exports.ltbot = async event => {
    let body = JSON.parse(event.body);
    const bot = new Telegraf(config.telegram.token);

    bot.start((ctx) => {
        return ctx.reply('Hello')
    });
    bot.help((ctx) => {
        return ctx.reply('I am *London Transporter*, and will help you during your commute! \n\n' +
            'These are the commands you can use: \n\n' +
            '/ask _central_ - Ask for the current status of a line \n' +
            '\n\n' +
            'You can also ask me stuff in a more natural way. I will answer! \n' +
            'How is _central_? - Ask for the current status of a line', markup);
    });


    bot.hears(/^[Hh]ow is (.+)\?$/, async (ctx) => {
        try{
            const result = await requestLineStatus(ctx.message.text.slice(7, -1));
            return ctx.reply(statusWriter(result), markup);
        } catch (e) {
            return ctx.reply(`⚠ There was an error ⚠\n${e.message}`)
        }
    });
    bot.hears(/^\/ask (.+)$/, async (ctx) => {
        try{
            const result = await requestLineStatus(ctx.message.text.slice(5));
            return ctx.reply(statusWriter(result), markup);
        } catch (e) {
            return ctx.reply(`⚠ There was an error ⚠\n${e.message}`)
        }
    });
    bot.command('/ask', async (ctx) => {
        return ctx.reply('Ask for a tube line following the command /ask');
    })

    await bot.handleUpdate(body);
    return {statusCode: 200};
}