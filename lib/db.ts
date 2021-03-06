import AWS from 'aws-sdk';
import {DynamoDB} from "../types/types";
import moment from 'moment-timezone';

const config = require('../config');

let documentClient = new AWS.DynamoDB.DocumentClient({'region': config.dynamodb.region});

export function writeCommute (commute: DynamoDB.Commute){
    let params = {
        TableName: config.dynamodb.table_name,
        Item: {
            telegram_id: commute.telegram_id,
            commute: commute.commute
        }
    };
    documentClient.put(params, function (err) {
        if (err) {
            throw err;
        }
    });
}

export function deleteCommute (telegram_id: string){
    let params = {
        TableName: config.dynamodb.table_name,
        Key: {
            telegram_id
        }
    };
    documentClient.delete(params, function (err) {
        if (err) {
            throw err;
        }
    });
}

export async function getCommute (telegram_id: string){
    let params = {
        TableName: config.dynamodb.table_name,
        Key: {
            telegram_id
        }
    };
    return documentClient.get(params, function (err) {
        if (err) {
            throw err;
        }
    }).promise();
}

export function writeCommuteRecurrentHour (telegram_id: string, recurrent_hour: string){
    let params = {
        TableName: config.dynamodb.table_name,
        Key: {
            telegram_id
        },
        UpdateExpression: 'SET recurrent_hour = :x',
        ExpressionAttributeValues: {
            ':x': recurrent_hour,
        }
    };
    return documentClient.update(params, function (err) {
        if (err) {
            throw err;
        }
    });
}

export function deleteCommuteRecurrentHour (telegram_id: string){
    let params = {
        TableName: config.dynamodb.table_name,
        Key: {
            telegram_id
        },
        UpdateExpression: 'REMOVE recurrent_hour'
    };
    return documentClient.update(params, function (err) {
        if (err) {
            throw err;
        }
    });
}

export async function findCurrentCommutes(){
    const currentTime = moment(new Date()).tz("Europe/London").format('HH:mm');
    let params = {
        TableName: config.dynamodb.table_name,
        FilterExpression : '#rh = :currentTime',
        ExpressionAttributeNames: {'#rh': 'recurrent_hour'},
        ExpressionAttributeValues : {':currentTime' : currentTime}
    };
    return documentClient.scan(params, function (err) {
        if (err) {
            throw err;
        }
    }).promise();
}