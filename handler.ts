import { requestLineStatus, requestCommuteStatus, findMatchingLine} from './lib/tflRequester';
import * as dynamodb from './lib/db';
import { statusWriter, commuteStatusWriter } from './lib/helpers';
import * as constants from './constants';

const config = require('./config');
const { Telegraf } = require('telegraf');
const extra = require('telegraf/extra');
const markup = extra.markdown();


module.exports.ltbot = async event => {
    try {
        let body = JSON.parse(event.body);
        const bot = new Telegraf(config.telegram.token);

        bot.start((ctx) => {
            return ctx.reply(constants.text.start, markup)
        });
        bot.help((ctx) => {
            return ctx.reply(constants.text.help, markup);
        });

        bot.hears(/^[Hh]ow is (.+)\?$/, async (ctx) => {
            try {
                const result = await requestLineStatus(ctx.message.text.slice(7, -1).trim());
                return ctx.reply(statusWriter(result), markup);
            } catch (e) {
                return ctx.reply(`${constants.text.error}${e.message}`)
            }
        });
        bot.hears(/^[Ss]how me my commute!?$/, async (ctx) => {
            try {
                const result = await requestCommuteStatus((await dynamodb.getCommute(ctx.from.id)).Item.commute);
                return ctx.reply(commuteStatusWriter(result), markup);
            } catch (e) {
                return ctx.reply(`${constants.text.error}${e.message}`)
            }
        });
        bot.hears(/^\/ask (.+)$/, async (ctx) => {
            try {
                const request = ctx.message.text.slice(5).trim();
                if (request === 'commute'){
                    const result = await requestCommuteStatus((await dynamodb.getCommute(ctx.from.id)).Item.commute);
                    return ctx.reply(commuteStatusWriter(result), markup);
                } else {
                    const result = await requestLineStatus(ctx.message.text.slice(5).trim());
                    return ctx.reply(statusWriter(result), markup);
                }
            } catch (e) {
                return ctx.reply(`${constants.text.error}${e.message}`)
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
                await dynamodb.writeCommute(
                    {
                        commute,
                        telegram_id: ctx.from.id,
                    });
                await ctx.reply(`Okay! Your commute has been set! \n${commute.toString()}`);
            } catch (e) {
                return ctx.reply(`${constants.text.error}${e.message}`)
            }
        });
        bot.command('setcommute', async (ctx) => {
            return ctx.reply('Set your commute by adding the lines you want to set after the command /setcommute\nCheck /help for examples!');
        });

        bot.command('deletecommute', async (ctx) => {
            dynamodb.deleteCommute(ctx.from.id);
            return ctx.reply('Okay! Your commute has been deleted!');
        });

        bot.command('showcommute', async (ctx) => {
            const commuteItem = (await dynamodb.getCommute(ctx.from.id)).Item;
            return (commuteItem && Array.isArray(commuteItem.commute) && commuteItem.commute.length)
                ? ctx.reply(`Your commute is set to: \n*${commuteItem.commute}*`, markup)
                : ctx.reply(`You should set your commute first with /setcommute`);
        });

        await bot.handleUpdate(body);
        return {statusCode: 200};
    } catch (e) {
        return {statusCode: 500, error: e.message};
    }
}