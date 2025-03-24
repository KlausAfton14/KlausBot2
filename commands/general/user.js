const { SlashCommandBuilder, EmbedBuilder, roleMention, time } = require('discord.js');
const moment = require('moment-timezone');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Replies with user info!')
		.addUserOption(option =>    
            option.setName('user')
            .setDescription('who do you want to get info about')
            .setRequired(true)),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const member = interaction.guild.members.cache.get(user.id);

		const newEmbed = new EmbedBuilder()
		.setTitle(user.username)
		.setColor('#bd00ff')
		.setThumbnail(user.displayAvatarURL({ dynamic: true }))
		.setFields(
			({ name: 'ID', value: user.id}),
			({ name: 'Bot', value: user.bot ? 'Tak' : 'Nie'}),
			({ name: 'Dołączył do serwera', value: time(member.joinedAt, 'R') }),
			({ name: 'Dołączył do Discorda', value: time(user.createdAt, 'R') }),
			({ name: 'Roles', value: member.roles.cache.map( r => roleMention(r.id) ).join(' ') })	
        )
		.setTimestamp();

		await interaction.reply({ embeds: [newEmbed] });
	},
};