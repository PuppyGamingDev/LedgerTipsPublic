const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const { getxumm, getWallet } = require("../Utilities");
require("dotenv/config");
const { xrpToDrops } = require('xrpl')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tip")
        .setDescription("Tip a user linked to LedgerTips")
        .addUserOption((option) => option.setName("user").setDescription("The user to tip").setRequired(true))
        .addStringOption((option) => option.setName("amount").setDescription("The amount of XRP to tip the user").setRequired(true))
        .setDMPermission(false),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const user = interaction.options.getUser("user");
        const amount = parseFloat(interaction.options.getString("amount"));
        const wallet = getWallet(user.id);
        if (!wallet || wallet === undefined) {
            await interaction.editReply({ content: `This user is not linked to LedgerTips, why not suggest to them to use **/link** ?`, ephemeral: true });
            return;
        }
        const xumm = getxumm();
        const request = {
            TransactionType: "Payment",
            Destination: wallet,
            Amount: xrpToDrops(amount),
            Memos: [
                {
                    Memo: {
                        MemoData: Buffer.from(`Tip from ${interaction.user.username} via LedgerTips`).toString("hex"),
                    },
                },
            ],
        };

        const subscription = await xumm.payload.createAndSubscribe(request, async (event) => {
            if (event.data.signed === true) {
                return event.data;
            }
            if (event.data.signed === false) {
                return false;
            }
        });

        const transactEmbed = new EmbedBuilder()
            .setTitle(`Sign the tip!`)
            .setDescription(`Scan or visit the transaction link to continue`)
            .setColor(Colors.Gold)
            .setFields({ name: `Transaction Link`, value: `[Click Here](${subscription.created.next.always})` })
            .setImage(subscription.created.refs.qr_png);
        await interaction.editReply({ embeds: [transactEmbed], ephemeral: true });

        const resolveData = await subscription.resolved;
        if (resolveData === false) {
            await interaction.editReply({ content: `The transaction signing was rejected or failed`, embeds: [], ephemeral: true });
            return;
        } else {
            await interaction.editReply({ content: `Checking transaction.....`, embeds: [], ephemeral: true });
            const result = await xumm.payload.get(resolveData.payload_uuidv4);
            if (result.response.dispatched_nodetype === "MAINNET" && result.meta.resolved === true) {
                await interaction.editReply({ content: `Successfully sent a tip!`, ephemeral: true });
                await interaction.followUp({ content: `*<@${interaction.user.id}>* just tipped *<@${user.id}>* **${amount} ${token.name}** !` });
                return;
            } else {
                await interaction.editReply({ content: `There seems to have been an issue verifying the transaction`, embeds: [], ephemeral: true });
                return;
            }
        }
    },
};