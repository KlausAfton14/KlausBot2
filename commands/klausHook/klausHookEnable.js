const GuildModels = require('../../models/guildSchema');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('klaus_hook_enable')
		.setDescription('Enable KlausHook')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator, PermissionFlagsBits.ManageMessages)
        .addBooleanOption(option => 
            option.setName('enable')
            .setDescription('create/delete KlausHooks')
            .setRequired(true)),
	async execute(interaction) {

        const choice = interaction.options.getBoolean('enable'); 
        interaction.reply(`KlausHook is now **${choice ? "enabled" : "disabled"}**`);

        if (choice == false) {
            
            let channels = interaction.guild.channels.cache.filter(channel => channel.isTextBased());
            channels.forEach(channel => {
                channel.fetchWebhooks()
                .then(webhooks => {
                    const existingWebhook = webhooks.find(webhook => webhook.name === "KlausHook");
                    if (!existingWebhook) {
                        console.log(`Webhook doesn't exists on ${channel.name}`);
                    } else {
                        existingWebhook.delete()
                        .then(() => console.log(`Webhook on ${channel.name} deleted successfully`))
                        .catch(console.error);
                    }
                })
            });
        } 

        try {
            
            await GuildModels.findOneAndUpdate({
                guildID: interaction.guild.id
            }, {
                $set: {
                    klausHookEnabled: choice
                }
            });
        } catch (error) {
            console.log(error);
        }

        
	},
};