const { ActivityType } = require('discord.js');
const welcome = require('./guildMemberAdd.js')

module.exports = {
	name: 'ready',
	once: true,
	execute(client, interaction) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
        client.user.setActivity('you', { type: ActivityType.Watching });

	},
};