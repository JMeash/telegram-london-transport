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
                return ctx.reply(`Okay! Your commute has been set! \n${commute.toString()}`);
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

        bot.hears(/^\/setnotification (.+)$/, async (ctx) => {
            try {
                const hour = ctx.message.text.slice(17).trim();
                if(!/^(([0-1][0-9])|(2[0-3])):[0-5][05]$/.test(hour)){
                   return ctx.reply(`${constants.text.error}Please enter a valid hour in a 24 hour format in multiples of 5 e.g., _08:15_`, markup);
                }
                const commuteItem = (await dynamodb.getCommute(ctx.from.id)).Item;
                if (commuteItem && Array.isArray(commuteItem.commute) && commuteItem.commute.length){
                    dynamodb.writeCommuteRecurrentHour(ctx.from.id, hour);
                    return ctx.reply(`Okay! Your commute notifications are set to go off at *${hour}*`, markup);
                } else {
                   return ctx.reply(`${constants.text.error}You should set your commute first with /setcommute`);
                }
            } catch (e) {
                return ctx.reply(`${constants.text.error}${e.message}`);
            }
        });
        bot.command('setnotification', async (ctx) => {
            return ctx.reply(constants.text.notification, markup);
        });
        bot.command('deletenotification', async (ctx) => {
            dynamodb.deleteCommuteRecurrentHour(ctx.from.id);
            return ctx.reply('Okay! Your commute notification has been deleted!');
        });
        bot.command('shownotification', async (ctx) => {
            const commuteItem = (await dynamodb.getCommute(ctx.from.id)).Item;
            return (commuteItem && commuteItem.recurrent_hour)
                ? ctx.reply(`Your notification is set to go off at *${commuteItem.recurrent_hour}*`, markup)
                : ctx.reply(`You should set your notification first with /setnotification`);
        });

        await bot.handleUpdate(body);
        return {statusCode: 200};
    } catch (e) {
        return {statusCode: 500, error: e.message};
    }
}

module.exports.cron = async () => {
    try {
        const bot = new Telegraf(config.telegram.token);
        const commutesToNotify = (await dynamodb.findCurrentCommutes()).Items;
        if(commutesToNotify && Array.isArray(commutesToNotify)){
            for (const commute of commutesToNotify){
                const result = await requestCommuteStatus(commute.commute);
                //TODO only show if there's a problem with one of the lines
                await bot.telegram.sendMessage(commute.telegram_id, commuteStatusWriter(result), markup);
            }
        }
        return {statusCode: 200};
    } catch (e) {
        return {statusCode: 500, error: e.message};
    }
}