let config = {
    telegram: {},
    tfl: {},
    dynamodb: {},
};

config.tfl.url = 'https://api.tfl.gov.uk/';
config.tfl.token=  process.env.TFL_API_KEY || 'token';

config.telegram.token = process.env.TELEGRAM_TOKEN || 'telegram_token';

config.dynamodb.table_name = process.env.DYNAMODB_TABLE_NAME || 'randomTableName';
config.dynamodb.region = process.env.DYNAMODB_REGION || 'eu-west-1';
config.dynamodb.arn = process.env.DYNAMODB_ARN || 'localARN';


module.exports = config;