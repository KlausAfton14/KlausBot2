const { SlashCommandBuilder, ComponentType, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Lists all commands'),
	async execute(interaction) {

		const emojis = {
			info: '📝',
			moderation: '🛡️',
			general: '🪨',
			economy: '💵',
			klaushook: '🦜'
		};

		const directories = [
			...new Set(interaction.client.commands.map((cmd) => cmd.data.folder)),
		];

		const formatString = (str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`

		const categories = directories.map((dir) => {
			const getCommands = interaction.client.commands.filter((cmd) => cmd.data.folder === dir).map((cmd) => {
				return {
                    name: formatString(cmd.data.name),
                    description: cmd.data.description,
                    options: cmd.data.options
				}
			})

			return {
                directory: formatString(dir),
                commands: getCommands
            }
		})

		const embed = new EmbedBuilder({
			author: { name: interaction.client.user.username}
		})

		const components = (state) => [
			new ActionRowBuilder().addComponents( 
				new SelectMenuBuilder()
					.setCustomId("help-menu")
					.setPlaceholder("Please select a category")
					.setDisabled(state)
					.addOptions(
						categories.map((cmd) => {
							return {
								label: cmd.directory,
								value: cmd.directory.toLowerCase(),
								description: `Commands from ${cmd.directory} category.`,
								emoji: emojis[cmd.directory.toLowerCase() || null],
							};
						})
					)
			),
		];

		const initialMessage = await interaction.reply({ 
			embeds: [embed], 
			components: components (false),
		});

		const filter = (interaction) => interaction.user.id === interaction.member.id;
		const collector = interaction.channel.createMessageComponentCollector({
			filter,
			componentType: ComponentType.SelectMenu,
		});

		collector.on("collect", (i) => {
			if (i.user.id !== interaction.user.id) { 
				i.reply({ content: `These buttons aren't for you!`, ephemeral: true }); 
			} else {
				const [directory] = i.values;
				const category = categories.find(
					(x) => x.directory.toLowerCase() === directory
				);

				const categoryEmbed = new EmbedBuilder()
					.setTitle(`${formatString(directory)} commands`)
					.setDescription(
						`A list of all the commands categorized under ${directory}`
					)
					.addFields(
						category.commands.map((cmd) => { 
							const commandOptions = [];
							const options = cmd.options;
							if (options) {
								options.forEach(option => {
									commandOptions.push(option.name);
								});
							}
							const optionsList = commandOptions.join(', ');
							return {
								name: `\`${cmd.name}\``,
								value: `**${cmd.description}**\n*${optionsList || 'No options'}*`,
								inline: true,
							};
						})
					);
				i.update({ embeds: [categoryEmbed] });
			}
		})
		collector.on("end", () => { 
			initialMessage.edit({ components: components(true) });
		})
		
	},
};