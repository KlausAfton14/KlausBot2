const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const fetchAll = require('discord-fetch-all');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get')
		.setDescription('bozed')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {

        if (interaction.user.id.toString() !== '659762420327120936') return interaction.reply({ content: "You are not Klaus!!", ephemeral: true });

        // First parameter needs to be a discord.js channel object
        // Second parameter is a optional set of options.
        const allMessages = await fetchAll.messages(interaction.channel, {
            reverseArray: true, // Reverse the returned array
            userOnly: false, // Only return messages by users
            botOnly: false, // Only return messages by bots
            pinnedOnly: false, // Only returned pinned messages
        });

        const dir = './logs/ALL_CHANNEL';
        const numberOfFiles = fs.readdirSync(dir).length;
    
        const data = [];
    
        allMessages.forEach((message) => {
            if (!message.embeds.length > 0) {
                data.push(`\nA: ${message.author.username}\nC: ${message.content}\n`);
            } else {
                let embedData = `\nA: ${message.author.username}\nC: ${message.content}\n`;
    
                for (let embed of message.embeds) {
                    embedData += `\nTitle: ${embed.title}\nDescription: ${embed.description}\n`;
    
                    for (let field of embed.fields) {
                        embedData += `Field title: ${field.name}\nField value: ${field.value}\n`;
                    }
                }
    
                data.push(embedData);
            }
        });
    
        const fileData = data.join('\n');
    
        fs.appendFile(`./logs/ALL_CHANNEL/${numberOfFiles.toString()}-${allMessages.length}.txt`, fileData, (err) => {
            if (err) {
                console.error(err);
                interaction.reply('Failed to write to file.');
            } else {
                interaction.reply('File write successful.');
            }
        });
        
	},
};