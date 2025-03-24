const GuildModels = require('../../models/guildSchema');
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('langue')
		.setDescription('sets langue (actually do nothing)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction, guildData, client) {
        if(!guildData) return interaction.reply({ content: 'You are not registered yet! Try again', ephemeral: true });

        const row = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId('langue')
                .setPlaceholder(`none`)
                .addOptions(
                    {
                        label: 'english',
                        value: 'EN',
                    },
                    {
                        label: 'polski',
                        value: 'PL',
                    },
                ),
        );

        await interaction.reply({ content: `You chose ---`, components: [row], ephemeral: true});
	},
};