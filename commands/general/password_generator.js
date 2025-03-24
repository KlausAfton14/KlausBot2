const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('generate_password')
		.setDescription('Generate a secure random password.')
        .addNumberOption(option => option
            .setName('length')
            .setDescription('Length of the password (max 1000).')
            .setRequired(true))
        .addStringOption(option => option
            .setName('chars')
            .setDescription('Characters to use for the password or "default" for standard characters.')
            .setRequired(true)),
	async execute(interaction) {
		// Extract options
		const length = interaction.options.getNumber('length');
		const charInput = interaction.options.getString('chars');

		// Validate password length
		if (length > 1000) {
			return interaction.reply({
				content: '⚠️ Maximum password length is **1000** characters.',
				ephemeral: true,
			});
		}

		// Determine character set
		let chars;
		if (charInput === 'default') {
			chars = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		} else if (charInput.trim() === '') {
			return interaction.reply({
				content: '⚠️ Character set cannot be empty. Please provide valid characters or use "default".',
				ephemeral: true,
			});
		} else {
			chars = charInput;
		}

		// Generate password
		let gpassword = '';
		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * chars.length);
			gpassword += chars[randomIndex];
		}

		// Reply with the generated password
		await interaction.reply({
			content: `🔒 **Your generated password is:**\n\`\`\`${gpassword}\`\`\``,
			ephemeral: true,
		});
	},
};