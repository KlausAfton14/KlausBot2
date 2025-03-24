const { SlashCommandBuilder } = require('discord.js');
const crypto = require('node:crypto');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hash')
		.setDescription('Generate a hash of your input text.')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The text you want to hash.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('hash_type')
                .setDescription('The type of hash to generate.')
            .addChoices(
                { name: 'sha512', value: 'sha512' },
                { name: 'sha256', value: 'sha256' }
            )
            .setRequired(true)),
        
	async execute(interaction) {
        
        const text = interaction.options.getString('input');
        hash_type = interaction.options.getString('hash_type');
        const hash = crypto.createHmac(hash_type, text).digest('hex');
        
        await interaction.reply({ content: hash, ephemeral: true});

	},
};