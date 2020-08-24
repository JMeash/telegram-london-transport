# London Alert

[London Alerter Bot](https://t.me/LondonAlerterBot) is a minimalistic Telegram bot that connects to the TFL API
and can be used to check the status of the transport in London. You can also set it up to notify you of problems in your commute.


### Setting up

If you want to create your own instance of this bot, run `npm install -g serverless`. You could create a new serverless.yml with the create command, or use the one in the root file and change
the variables with your own.

Make sure your credentials are correctly [set up](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/) and that a DynamoDB table is in place.

To continue, make sure you create a bot with the [BotFather](https://core.telegram.org/bots) and save the telegram token.

Finally, make sure you have a TFL developer API token. 

### Running it

To run, make sure you create a .env with the necessary variables or substitute them in config.js.

Finally, execute `serverless deploy`.

## Built With

* [AWS Dynamo](https://aws.amazon.com/en/dynamodb/) - AWS database used to store commutes
* [AWS Lambda](https://aws.amazon.com/en/lambda/) - Used to run everything serverless
* [Serverless](https://www.serverless.com/) - Used for serverless development and deployment
* [Telegraf](https://telegraf.js.org/#/) - Telegram Bot Framework

## Authors

* **José Manuel Medrano Martínez** - [JMeash](https://github.com/JMeash)

## License

This project is licensed under the GNU GPLv3 License - see the LICENSE.md file for details