const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');
require('dotenv/config')
const mongoConnect = require('./mongo-connect.js')
const { reloadWallets } = require('./Utilities.js')

// Declare needed Intents
const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

// Declare and Map commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

// Runs when bot logs in
client.once('ready', async () => {
    await mongoConnect()
    await reloadWallets()
    console.log(`RippleTips is running!`);
});

// Slash Command handling
client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});


// Logs the bot in
client.login(process.env.TOKEN);