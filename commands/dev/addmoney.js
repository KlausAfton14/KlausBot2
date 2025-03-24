const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const ProfileModels = require('../../models/profileSchema');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('addmoney')
		.setDescription('only for Klaus')
        .setDefaultMemberPermissions('0')
        .addUserOption(option =>    
            option.setName('user')
            .setDescription('who u want to add money to')
            .setRequired(true))
        .addNumberOption(option =>
            option.setName('amount')
            .setDescription('how much money u want to add')
            .setRequired(true)),
	async execute(interaction, profileData) {
        
        if (interaction.user.id.toString() !== '659762420327120936') return interaction.reply({ content: "You are not Klaus!!", ephemeral: true });
		const user = interaction.options.getUser('user');
        const amount = interaction.options.getNumber('amount');

        if(!profileData) return interaction.reply({ content: 'You are not registered yet! Try again', ephemeral: true });

        try {
            
            await ProfileModels.findOneAndUpdate({
                userID: user.id
            }, {
                $inc: {
                    coins: amount
                }
            });


        } catch (error) {
            console.log(error);
        }

        const newEmbed = new EmbedBuilder()
            .setTitle('Added money')
            .setDescription(`${user.username} has been added ${amount} coins`)
            .setColor('#bd00ff')

        await interaction.reply({ embeds: [newEmbed], ephemeral: true });


	},
};