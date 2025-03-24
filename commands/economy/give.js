const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ProfileModels = require('../../models/profileSchema');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('give')
		.setDescription('Give someone money.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user you want to give your money to.')
                .setRequired(true))
        .addNumberOption(option =>
            option
                .setName('amount')
                .setDescription('The amount of money you want to give.')
                .setRequired(true)),
	async execute(interaction, profileData) {
		const targetUser = interaction.options.getUser('user');
		const amountToGive = interaction.options.getNumber('amount');

		if (!profileData) {
			return interaction.reply({
				content: '❌ You are not registered yet!',
				ephemeral: true,
			});
		}

		if (amountToGive <= 0) {
			return interaction.reply({
				content: '❌ You must give a positive amount of money!',
				ephemeral: true,
			});
		}

		if (targetUser.id === interaction.user.id) {
			return interaction.reply({
				content: '❌ You cannot give money to yourself.',
				ephemeral: true,
			});
		}

		if (amountToGive > profileData.coins) {
			return interaction.reply({
				content: `❌ You only have **$${profileData.coins}**, which is not enough!`,
				ephemeral: true,
			});
		}

		try {
			await ProfileModels.findOneAndUpdate(
				{ userID: interaction.user.id },
				{ $inc: { coins: -amountToGive } }
			);

			await ProfileModels.findOneAndUpdate(
				{ userID: targetUser.id },
				{ $inc: { coins: amountToGive } }
			);

			const confirmationEmbed = new EmbedBuilder()
				.setTitle('💸 Money Transfer')
				.setDescription(`✅ You gave **${amountToGive} coins** to **${targetUser.username}**.`)
				.setColor('#bd00ff')
				.setTimestamp();

			await interaction.reply({ embeds: [confirmationEmbed] });

		} catch (error) {
			console.error('Error transferring money:', error);
			await interaction.reply({
				content: '❌ An error occurred while processing the transaction. Please try again later.',
				ephemeral: true,
			});
		}
	},
};