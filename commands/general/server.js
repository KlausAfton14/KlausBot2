const { SlashCommandBuilder, EmbedBuilder, userMention, time } = require('discord.js');
const moment = require('moment-timezone');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Replies with server info!'),
	async execute(interaction) {

		const { guild } = interaction;
		await guild.members.fetch();
		const botCount = guild.members.cache.filter((m) => m.user.bot).size;
		const roles = guild.roles.cache.filter((r) => !r.managed).toJSON().join('\n')

		const newEmbed = new EmbedBuilder({
			author: { name: `${guild.name} / ${guild.id}`, iconURL: guild.iconURL({ size: 256 }) },
			fields: [
				{ name: 'Owner', value: userMention((await guild.fetchOwner()).user.id), inline: true },
				{ name: 'Created at', value: time(guild.createdAt, 'R'), inline: true },
				{ name: 'Voice Channels', value: guild.channels.cache.filter((c) => c.type === 2).toJSON().length, inline: true },
				{ name: 'Text Channels', value: guild.channels.cache.filter((c) => c.type === 0).toJSON().length, inline: true },
				{ name: 'Category Channels', value: guild.channels.cache.filter((c) => c.type === 4).toJSON().length, inline: true },
				{ name: 'Members', value: guild.memberCount - botCount, inline: true },
				{ name: 'Bots', value: botCount, inline: true },
				{ name: 'Roles', value: guild.roles.cache.size, inline: true },
				{ name: 'Role List', value:roles.length > 1024 ? roles.slice(0, 1021) + '...' : roles }
			],
		})
		.setTimestamp();

        await interaction.reply({ embeds: [newEmbed] });
	},
};