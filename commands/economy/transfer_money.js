const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const ProfileModels = require('../../models/profileSchema');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('transfer_money')
		.setDescription('Transfers your money')
        .addStringOption(option =>
            option.setName('where')
            .setDescription('Where do you want to transfer your money')
            .addChoices(
                { name: 'From Bank to Wallet', value: '1' },
                { name: 'From Wallet to Bank', value: '2' }
            )
            .setRequired(true))
        .addNumberOption(option =>
            option.setName('amount')
            .setDescription('How much money do you want to transfer')
            .setRequired(true)),
	async execute(interaction, profileData) {
        const where = interaction.options.get('where').value;
        const amount = interaction.options.get('amount').value;
        
        if(!profileData) return interaction.reply({ content: 'You are not registered yet! Try again', ephemeral: true });
        if(amount <= 0) return interaction.reply({ content: 'Nice try Diddy', ephemeral: true})
        
        if(where === '1') {
            try {
                if(amount > profileData.bank) return interaction.reply({ content: `You have not enough in **bank!**`, ephemeral: true });
                
                await ProfileModels.findOneAndUpdate({
                    userID: interaction.user.id
                }, {
                    $inc: {
                        bank: -amount,
                        coins: amount
                    }
                });
            } catch (error) {
                console.log(error);
            }

            const newEmbed = new EmbedBuilder()
            .setTitle('Money moved!')
            .setDescription(`**Moved $${amount} from bank**`);

            interaction.reply({ embeds: [newEmbed], ephemeral: true });
        } else if (where === '2') {
            try {
                if(amount > profileData.coins) return interaction.reply({ content: `You have not enough in **wallet!**`, ephemeral: true });
                
                await ProfileModels.findOneAndUpdate({
                    userID: interaction.user.id
                }, {
                    $inc: {
                        bank: amount,
                        coins: -amount
                    }
                });
            } catch (error) {
                console.log(error);
            }

            const newEmbed = new EmbedBuilder()
            .setTitle('Money moved!')
            .setDescription(`**Moved $${amount} from wallet**`);

            interaction.reply({ embeds: [newEmbed], ephemeral: true });
        }
    }
};