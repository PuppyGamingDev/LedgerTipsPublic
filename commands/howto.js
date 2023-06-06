const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("howto")
        .setDescription("How to use the RippleTips Bot"),
    async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setTitle(`How to get tipping`)
            .setDescription(`All you need to do to be able to receive any tips through RippleTips Bot is use the /link command to sign into the bot with your XUMM wallet allowing the bot to know where to send your tips!`)
            .setColor(Colors.Gold)
            .setFields(
                { name: `/link`, value: `Link your wallet to the bot to be able to receive tips!` },
                { name: `/tip`, value: `Tip a user who is linked to the bot using any of the provided currencies (as long as trustline is available)` },
            )
            .setFooter({ text: `RippleTips powered by puppy.tools`, iconURL: interaction.client.user.avatarURL() })

        await interaction.reply({ embeds: [helpEmbed] });
    },
};