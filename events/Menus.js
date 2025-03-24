const GuildModels = require('../models/guildSchema');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        //LANG

	    if (interaction.customId === 'langue') {
		    await interaction.deferUpdate();
		    await wait(420);
		    await (await interaction.editReply({ content: 'Something was selected!', components: [] }));

            const lang = interaction.values.toString();
            console.log(`USER: ${interaction.user.tag}\nCHANGED LANGUAGE TO: ${lang}\nIN: ${interaction.guild.name}`);
            
                try {
            
                    await GuildModels.findOneAndUpdate({
                        guildID: interaction.guild.id
                    }, {
                        $set: {
                            lang: lang
                        }
                    });
        
                } catch (error) {
                    console.log(error);
                }

	    }
    },
};