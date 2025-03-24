const Discord = require('discord.js');
const ProfileModels = require('../models/profileSchema');
const GuildModels = require('../models/guildSchema');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        //if (interaction.channel === null || interaction.channel.type === 'DM') return interaction.reply({content: 'Commands in DM are not allowed!', ephemeral: true}); 
        await console.log(`
        USER: ${interaction.user.tag}
        COMMAND CONTENT: ${interaction.commandName}
        CHANNEL: #${interaction.channel ? interaction.channel.name : 'default'}
        SERVER: ${interaction.guild ? interaction.guild.name : 'default'}  /  ${interaction.guild ? interaction.guild.id : 'default'}
        TRIGGERED AT: ${interaction.createdAt}
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
        `);    

    },
};