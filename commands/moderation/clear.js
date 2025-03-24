const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clear messages')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator, PermissionFlagsBits.ManageMessages)
        .addNumberOption(option => 
            option.setName('amount')
            .setDescription('how many messages do you want to delete')
            .setRequired(true)),
	async execute(interaction) {
        
        const amount = interaction.options.getNumber('amount');
        if (amount > 100) return interaction.reply(`Nice try diddy`);
		await interaction.channel.bulkDelete(amount);
        await interaction.reply({ content: `Deleted ${amount} messages`, ephemeral: true });
	},
};