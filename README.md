# LedgerTips Discord Bot
LedgerTips is a Discord bot that enables users to be able tp tip eachother mostly from inside Discord utilizing the XUMM API to sign the transactions.

## Initial setup
Create a new file called `.env` and paste the following into it
```
TOKEN=
CLIENTID=
MONGOURI=
XUMM_API_KEY=
XUMM_API_SECRET=
```
Install the required packages with `npm install` or `npm i discord.js mongoose xumm-sdk dotenv`

While they are installing you can begin gathering your information for the `.env` file.

- `TOKEN` and `CLIENTID` are your Bot Token and Client ID from Discord Application > [GUIDE HERE](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
- `MONGOURI` is a MongoDB Connection String > [GUIDE HERE](https://www.mongodb.com/docs/guides/atlas/connection-string/)
- `XUMM_API_KEY` and `XUMM_API_SECRET` require you to create an application with XUMM and get the values > [GUIDE HERE](https://xumm.readme.io/docs/register-your-app)

Once you have all your values, in the console run `node deploy-commands.js` and it will register the Bot's commands globally so any server the bot is in will be able to use them.


On the Discord Developer Dashboard for your application, navigate to `OAUTH2 > URL Generator` and tick the boxes for `bot` & `application.commands` and copy the URL that is generated below it and paste into your browser to invite the bot to your server. (The bot shouldn't need any extra permissions as all interactions are based on replying to interactions and not actual posting)

Once your bot is in, in the console run `node bot.js` and you should see that it's running when it outputs `LedgerTips is running!`

## Commands

### /howto
This command will respond with an Embed containing the commands and information

### /link
This command should be used by a user once to register their wallet address with the Bot using the XUMM SignIn process. The wallet address used to sign is then stored against the users Discord ID as a reference for receiving tips.
> ⚠️ **Users must be linked to receive tips or the Bot wouldn't know where to send it**

### /tip
User can select a user to receive the tip and also an amount of XRP to send. If the receiver hasn't linked their wallet yet, the Bot will response notifying them of it and no transactions will take place. It will always check if the receiver wallet is known before creating a transaction.

## Finishing up
If you have any questions, my DMs are always open on

- Twitter > @iamshiffed
- Discord > Shiffed#2071
- Email > puppygamingdev@gmail.com

Tips are always welcome and help continue development

XRPL: `rm2AEVUcxeYh6ZJUTkWUqVRPurWdn4E9W`
