const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls a dice.'),
	async execute(interaction) {

        var gifs = ['https://cdn.discordapp.com/attachments/877588809095725106/943956266651386016/kostka1.gif', 'https://cdn.discordapp.com/attachments/877588809095725106/943956267137921114/kostka2.gif', 'https://cdn.discordapp.com/attachments/877588809095725106/943956267746091008/kostka3.gif', 'https://cdn.discordapp.com/attachments/877588809095725106/943956268492673054/kostka4.gif'];
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

        const roll = Math.floor(Math.random() * 6) + 1;
		const newEmbed = new EmbedBuilder()
		.setTitle('Roll')
		.setDescription(`*You rolled a* **${roll}**`)
		.setColor('#bd00ff')
		.setImage(randomGif);

		await interaction.reply({ embeds: [newEmbed] });
	},
};