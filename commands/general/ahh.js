const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ahhh')
		.setDescription('AHHHHHH'),
	async execute(interaction) {
		await interaction.reply({ files: ['./assets/AHHHHHHH_Sound_Effect.mp4'] });
	},
};