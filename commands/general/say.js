const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Send a message with optional attachment')
        .addStringOption(option =>
            option.setName('input')
            .setDescription('The message you want to send')
            .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('attachment')
            .setDescription('Optional attachment to include in the message')),
	async execute(interaction) {

        if (interaction.options.getAttachment('attachment')) {
            const message = interaction.options.getString('input');
            const attachmentSay = interaction.options.getAttachment('attachment');
            await interaction.reply({ content: message, files: [attachmentSay] });
        } else {
            const message = interaction.options.getString('input');
            await interaction.reply({ content: message });
        }
	},
};