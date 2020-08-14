import { requestLineStatus, findMatchingLine} from './lib/tflRequester';
import { statusWriter } from './lib/helpers';

const config = require('./config');
const { Telegraf } = require('telegraf');
const extra = require('telegraf/extra');
const markup = extra.markdown();


module.exports.ltbot = async event => {
    try {
        let body = JSON.parse(event.body);
        const bot = new Telegraf(config.telegram.token);

        bot.start((ctx) => {
            return ctx.reply('Hello, I am *London Transporter*. Set up your commute and never be surprised by the status of a line again! \n' +
                'If you want to know how to use me, you can start by using /help', markup)
        });
        bot.help((ctx) => {
            return ctx.reply('I am *London Transporter*, and will help you during your commute! \n\n' +
                'These are the commands you can use: \n\n' +
                '/ask _central_ - Ask for the current status of a line \n' +
                '/setcommute _central_ _victoria_ - Set your commute \n' +
                '\n\n' +
                'You can also ask me stuff in a more natural way. I will answer! \n' +
                'How is _central_? - Ask for the current status of a line', markup);
        });

        bot.hears(/^[Hh]ow is (.+)\?$/, async (ctx) => {
            try {
                const result = await requestLineStatus(ctx.message.text.slice(7, -1).trim());
                return ctx.reply(statusWriter(result), markup);
            } catch (e) {
                return ctx.reply(`⚠ There was an error ⚠\n${e.message}`)
            }
        });
        bot.hears(/^\/ask (.+)$/, async (ctx) => {
            try {
                const result = await requestLineStatus(ctx.message.text.slice(5).trim());
                return ctx.reply(statusWriter(result), markup);
            } catch (e) {
                return ctx.reply(`⚠ There was an error ⚠\n${e.message}`)
            }
        });
        bot.command('ask', async (ctx) => {
            return ctx.reply('Ask for a tube line following the command /ask');
        });

        bot.hears(/^\/setcommute (.+)$/, async (ctx) => {
            try {
                const commute = [];
                const lines = (ctx.message.text.slice(12).trim().split(' '));
                for (const line of lines){
                    commute.push(findMatchingLine(line).id);
                }
                //TODO save commute
                await ctx.reply(`Okay! Your commute has been set! \n${commute.toString()}`);
            } catch (e) {
                return ctx.reply(`⚠ There was an error ⚠\n${e.message}`)
            }
        });
        bot.command('setcommute', async (ctx) => {
            return ctx.reply('Set your commute by adding the lines you want to set after the command /setcommute');
        });
        /*bot.command('/deletecommute', async (ctx) => {
            return ctx.reply('');
        });
        bot.command('showcommute', async (ctx) => {
            return ctx.reply('Okay');
        });*/

        await bot.handleUpdate(body);
        return {statusCode: 200};
    } catch (e) {
        return {statusCode: 500, error: e.message};
    }
}