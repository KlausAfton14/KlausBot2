const { SlashCommandBuilder, PermissionFlagsBits, Attachment} = require('discord.js');
const GuildModels = require('../../models/guildSchema');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say3')
		.setDescription('mimic someone')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>    
            option.setName('user')
            .setDescription('who u want to mimic')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('input')
            .setDescription('what u want to say')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('user2')
            .setDescription('what u want to say')
            .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('attachment')
            .setDescription('put there an attachment if u want')),
	async execute(interaction) {
        try {
            const guildData = await GuildModels.findOne({ guildID: interaction.guildId });

            if (guildData && guildData.klausHookEnabled) {
                const user = interaction.options.getUser('user');
                const member = interaction.guild.members.cache.get(user.id);
                const message = interaction.options.getString('input');
                const user2 = interaction.options.getString('user2');
                const channel = interaction.channel;

                let webhook = await findOrCreateWebhook(channel);
                await webhook.send({
                    content: message,
                    username: user2,
                    avatarURL: user.avatarURL() || undefined,
                });
            } else {
                await interaction.reply({ content: `KlausHook is disabled on this server`, ephemeral: true });
            }
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply({ content: 'An error occurred while processing your command.', ephemeral: true });
        }
	},
};

async function findOrCreateWebhook(channel) {
    const webhooks = await channel.fetchWebhooks();
    let webhook = webhooks.find(wh => wh.name == 'KlausHook');

    if (!webhook) {
        console.log('No webhook was found, creating a new one...');
        webhook = await channel.createWebhook({
            name: 'KlausHook',
            avatar: 'https://i.imgur.com/AfFp7pu.png',
        })
    }

    return webhook;
}