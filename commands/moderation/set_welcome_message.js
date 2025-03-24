const GuildModels = require('../../models/guildSchema');
const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, WelcomeChannel } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('welcome')
		.setDescription('sets welcome message')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('message')
                .setDescription('set welcome message')
                .addStringOption(option =>
                    option.setName('input')
                    .setDescription('write the welcome message')
                    .setRequired(true)))
        .addSubcommand(subcommand =>
		    subcommand
			    .setName('channel')
			    .setDescription('set wellcome channel')
			    .addChannelOption(option =>
                    option.setName('channel')
                    .setDescription('chose channel')
                    .addChannelTypes(ChannelType.GuildText)
                    .setRequired(true))),

	async execute(interaction) {

        if (interaction.options.getSubcommand() === "message") {

            try {
            
                await GuildModels.findOneAndUpdate({
                    guildID: interaction.guild.id
                }, {
                    $set: {
                        welcomeMessage: interaction.options.getString('input')
                    }
                });
    
            } catch (error) {
                console.log(error);
            }
    
            await interaction.reply({ content: `Welcome message is now **"${interaction.options.getString('input')}"**` });

        } else if (interaction.options.getSubcommand() === 'channel') {

            const twelcomeChannel = interaction.options.getChannel('channel');

            try {
            
                await GuildModels.findOneAndUpdate({
                    guildID: interaction.guild.id
                }, {
                    $set: {
                        welcomeChannelId: twelcomeChannel.id.toString(),
                    }
                });
    
            } catch (error) {
                console.log(error);
            }

            await interaction.reply({ content: `Welcome channel is now **${twelcomeChannel}**` });

        }
		


	},
};