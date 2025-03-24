const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say2')
		.setDescription('say what you want')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('input')
            .setDescription('what do you want to say')
            .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('attachment')
            .setDescription('put there an attachment if you want')),
	async execute(interaction) {
        const channel = interaction.channel;

        if (interaction.options.getAttachment('attachment')) {
            const message = interaction.options.getString('input');
            const attachmentSay = interaction.options.getAttachment('attachment');
            await channel.send({ content: message, files: [attachmentSay] });
        } else {
            const message = interaction.options.getString('input');
            await channel.send({ content: message });
        }
	},
};