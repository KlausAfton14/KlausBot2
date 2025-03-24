const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MimicModels = require('../../models/mimicSchema');
const GuildModels = require('../../models/guildSchema');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mimic')
		.setDescription('Mimic commands.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('register')
				.setDescription('Registers a mimic.')
				.addStringOption(option =>
					option.setName('name').setDescription('Your mimic name').setRequired(true))
				.addAttachmentOption(option =>
					option.setName('avatar').setDescription('Your mimic avatar').setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('stop')
				.setDescription('Stops a mimic.')
				.addStringOption(option =>
					option.setName('mimic').setDescription('Which mimic do you want to stop').setRequired(true))
		)
        .addSubcommand(subcommand =>
			subcommand
				.setName('start')
				.setDescription('Starts a mimic.')
				.addStringOption(option =>
					option.setName('mimic').setDescription('Which mimic you want to start').setRequired(true))
		),
	async execute(interaction) {
		const guildData = await GuildModels.findOne({ guildID: interaction.guildId });

		if (!guildData || !guildData.klausHookEnabled) {
			return interaction.reply({
				content: `❌ KlausHook is disabled on this server.`,
				ephemeral: true,
			});
		}

		switch (interaction.options.getSubcommand()) {
			case 'register':
				try {
					const mimicName = interaction.options.getString('name');
					const mimicAvatar = interaction.options.getAttachment('avatar');

					let mimic = await MimicModels.create({
						mimicName,
						avatarURL: mimicAvatar.url,
						ownerID: interaction.user.id,
                        isctive: false
					});
					await mimic.save();

					const embed = new EmbedBuilder()
						.setTitle(`✅ Mimic **${mimicName}** successfully registered!`)
						.setColor('#00FF00');

					await interaction.reply({ embeds: [embed] });
				} catch (err) {
					await interaction.reply({
						content: '❌ An error occurred while registering the mimic.',
						ephemeral: true,
					});
				}
				break;

			case 'start':

                try {
                    await interaction.deferReply();
                    const mimicName = interaction.options.getString('mimic');
                    const mimicData = await MimicModels.findOne({
                        mimicName,
                        ownerID: interaction.user.id,
                    });

                    const activeMimicsData = await MimicModels.findOne({
                        ownerID: interaction.user.id,
                        isActive: true
                    });

                    if (!mimicData) {
                        return interaction.editReply({
                            content: `❌ Mimic **${mimicName}** not found or not owned by you.`,
                        });
                    }

                    if (activeMimicsData) {
                        return interaction.editReply({
                            content: `❌ You have one active mimic already **(${activeMimicsData.mimicName})**.`,
                        });
                    }

                    mimicData.isActive = true;
                    await mimicData.save();

                    const webhook = await findOrCreateWebhook(interaction.channel);

                    const collector = interaction.channel.createMessageCollector({
                        filter: msg => msg.author.id === interaction.user.id,
                    });

                    collector.on('collect', async msg => {

                        const stillActiveMimicData = await MimicModels.findOne({
                            mimicName,
                            ownerID: interaction.user.id,
                            isActive: true
                        });

                        if(!stillActiveMimicData) return;

                        try {
                            await webhook.send({
                                content: msg.content,
                                username: mimicData.mimicName,
                                avatarURL: mimicData.avatarURL,
                            });
                            msg.delete();
                        } catch (error) {}
                    });

                    await interaction.editReply({
                        content: `✅ Mimic **${mimicName}** **started**. Messages you send **will be mimicked**.`,
                    });
                    break;

                } catch (err) {
                    console.log(err);
                }
            
            case 'stop':

                try {
                    await interaction.deferReply();
                    const mimicName = interaction.options.getString('mimic');

                    const activeMimicsData = await MimicModels.findOne({
                        mimicName,
                        ownerID: interaction.user.id,
                        isActive: true
                    });

                    if (!activeMimicsData) {
                        return interaction.editReply({
                            content: `❌ You have no mimic under name **${mimicName}** to stop`,
                        });
                    }

                    activeMimicsData.isActive = false;
                    await activeMimicsData.save();

                    await interaction.editReply({
                        content: `✅ Mimic **${mimicName}** **stoped**. Messages you send **will no longer be mimicked**.`,
                    });
                    break;
                    
                } catch (err) {
                    console.log(err);
                }
		}
	},
};

async function findOrCreateWebhook(channel) {
	const webhooks = await channel.fetchWebhooks();
	let webhook = webhooks.find(wh => wh.name === 'KlausHook');

	if (!webhook) {
		webhook = await channel.createWebhook({
			name: 'KlausHook',
			avatar: null,
		});
	}

	return webhook;
}