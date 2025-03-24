const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('sex')
		.setDescription('sex?')
		.addUserOption(option =>    
            option.setName('user')
            .setDescription('who u want to have sex with')),    
    execute: async (interaction, client) => {

		const cuser = interaction.options.getUser('user');
        const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('sex_yes')
				.setLabel('YES')
				.setStyle(ButtonStyle.Success),
            new ButtonBuilder()
				.setCustomId('sex_no')
				.setLabel('NO')
				.setStyle(ButtonStyle.Danger),
		);

		const message = await interaction.reply({ content: `sex? ${cuser}`, components: [row] });
        const collector = message.createMessageComponentCollector({ filter: (i) => i.user.id === cuser.id, max: 1 });

		collector.on('collect', async (i) => {
			switch (i.customId) {
				case 'sex_yes':
					await i.update({ content: `**${cuser} wants sex with ${interaction.user}**`, components: [] });
				case 'sex_no':
					await i.update({ content: `**${cuser} doesn't want sex with ${interaction.user}**`, components: [] });
			};
			collector.stop();
		});
    }
	
}; 


