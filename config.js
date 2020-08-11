let config = {
    telegram: {},
    tfl: {}
};

config.tfl.url = 'https://api.tfl.gov.uk/';
config.tfl.token=  process.env.TFL_API_KEY || 'token';

config.telegram.token = process.env.TELEGRAM_TOKEN || 'telegram_token';

module.exports = config;