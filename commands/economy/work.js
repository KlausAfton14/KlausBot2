const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const ProfileModels = require('../../models/profileSchema');

module.exports = {
    cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('industrial slave simulator'),
	async execute(interaction, profileData) {

        if(!profileData) return interaction.reply({ content: 'You are not registered yet! Try again', ephemeral: true });

        let reward = Math.floor(Math.random() * 1312) + 420;

        var responses = [
            `Impressive sales performance! You've earned a bonus of $${reward} for exceeding the quarterly targets.`,
            `Your efficiency in project management hasn't gone unnoticed. Here's a $${reward} reward for completing tasks ahead of schedule.`,
            `Exceptional client satisfaction scores! Enjoy a $${reward} bonus for delivering outstanding service.`,
            `Your coding skills have saved the day. Here's a $${reward} bonus for resolving that critical software bug.`,
            `Outstanding teamwork! Each team member receives a $${reward} bonus for the successful project collaboration.`,
            `Innovative solutions deserve recognition. Enjoy a $${reward} bonus for your groundbreaking ideas.`,
            `Excel mastery pays off! You've earned a $${reward} bonus for streamlining our financial reporting process.`,
            `Diplomacy at its finest! Your conflict resolution skills earn you a $${reward} bonus.`,
            `Creativity shines bright! Enjoy a $${reward} bonus for your imaginative contributions to the latest campaign.`,
            `Paper Plane Pentathlon champion! Here's a $${reward} bonus for your precision in the friendly competition.`
        ];

        let randomResponse = responses[Math.floor(Math.random() * responses.length)];
        try {
            
            await ProfileModels.findOneAndUpdate({
                userID: interaction.user.id
            }, {
                $inc: {
                    coins: reward
                }
            });
        } catch (error) {
            console.log(error);
        }

        const newEmbed = new EmbedBuilder()
        .setTitle('Nice job!')
        .setDescription(randomResponse);

        await interaction.reply({ embeds: [newEmbed], ephemeral: false });
    }
};