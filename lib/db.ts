import AWS from 'aws-sdk';
import {DynamoDB} from "../types/types";

const config = require('../config');

let documentClient = new AWS.DynamoDB.DocumentClient({'region': config.dynamodb.region});

export function writeCommute (commute: DynamoDB.Commute){
    let params = {
        TableName: config.dynamodb.table_name,
        Item: {
            telegram_id: commute.telegram_id,
            commute: commute.commute,
            recurrent_hour: commute.recurrent_hour || '8:00'
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