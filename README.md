# London Alert

[London Alerter Bot](https://t.me/LondonAlerterBot) is a minimalistic Telegram bot that connects to the TFL API
and can be used to check the status of the transport in London. You can also set it up to notify you of problems in your commute.

Currently, it only supports tube lines. There is a possibility that overground, tfl trains and buses are added in the future.

### Setting up

If you want to create your own instance of this bot, run `npm install -g serverless`. You could create a new serverless.yml with the create command, or use the one in the root file and change
the variables with your own.

Make sure your credentials are correctly [set up](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/) and that a DynamoDB table is in place.

To continue, make sure you create a bot with the [BotFather](https://core.telegram.org/bots) and save the telegram token.

Finally, make sure you have a TFL developer API token. 

### Running it

To run, make sure you create a .env with the necessary variables or substitute them in config.js.

Finally, execute `serverless deploy`. Link the lambda url to the telegram webhook with `https://api.telegram.org/<TOKEN>/setWebhook` by adding it to the body.

### Usage

These are the current commands:


[/ask _central_]() - Ask for the current status of a line\
[/ask _commute_]() - Ask for the status of your set commute\
[/setcommute _central_ _victoria_]() - Set your commute by adding lines after the command, you can only have one active commute at a time\
[/showcommute]() - Show the commute you have set\
[/deletecommute]() - Delete your current commute. Please note if you delete or change your commute your notification will also be deleted\
[/setnotification _08:15_]() - Set your notification time, you will be notified at the given time Monday to Friday if there is a problem in your commute\
[/deletenotification]() - Delete your current notification time\
[/shownotification]() - Show the notification you have set\


The idea behind this bot is to set a commute and set a notification. An example of this interaction would be:

```
/setcommute central waterloo
/setnotification 10:15
```

By doing this, every day between Monday and Friday at 10:15 there will be a check of the status. If one of the commute lines has a problem, then the bot will send a message informing you of the problem.

## Built With

* [AWS Dynamo](https://aws.amazon.com/en/dynamodb/) - AWS database used to store commutes
* [AWS Lambda](https://aws.amazon.com/en/lambda/) - Used to run everything serverless
* [Serverless](https://www.serverless.com/) - Used for serverless development and deployment
* [Telegraf](https://telegraf.js.org/#/) - Telegram Bot Framework

## Authors

* **José Manuel Medrano Martínez** - [JMeash](https://github.com/JMeash)

## License

This project is licensed under the GNU GPLv3 License - see the LICENSE.md file for details