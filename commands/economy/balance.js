const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Shows you your finances'),
	async execute(interaction, profileData) {

        if(!profileData) return interaction.reply({ content: 'You are not registered yet! Try again', ephemeral: true });

        const newEmbed = new EmbedBuilder()
        .setTitle('Balance')
        .setDescription(`**${interaction.user.username}'s account**`)
        .setFields(
            { name: 'Bank', value: profileData.bank.toString(), inline: true },
            { name: 'Coins', value: profileData.coins.toString(), inline: true }
        );
        interaction.reply({ embeds: [newEmbed] });

	},
};