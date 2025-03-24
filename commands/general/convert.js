const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch-commonjs');
const { Headers } = require('node-fetch-commonjs');
const { Currency_Data_API } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('convert')
		.setDescription('Convert units such as currencies.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('currency')
                .setDescription('Convert between currencies.')
                .addNumberOption(option =>
                    option.setName('value')
                        .setDescription('The amount to convert.')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('from')
                        .setDescription('The currency to convert from.')
                        .addChoices(
                            { name: "USD", value: "USD" },
                            { name: "EUR", value: "EUR" },
                            { name: "JPY", value: "JPY" },
                            { name: "GBP", value: "GBP" },
                            { name: "AUD", value: "AUD" },
                            { name: "CAD", value: "CAD" },
                            { name: "CHF", value: "CHF" },
                            { name: "CNY", value: "CNY" },
                            { name: "HKD", value: "HKD" },
                            { name: "NZD", value: "NZD" },
                            { name: "SEK", value: "SEK" },
                            { name: "KRW", value: "KRW" },
                            { name: "SGD", value: "SGD" },
                            { name: "NOK", value: "NOK" },
                            { name: "MXN", value: "MXN" },
                            { name: "INR", value: "INR" },
                            { name: "RUB", value: "RUB" },
                            { name: "ZAR", value: "ZAR" },
                            { name: "TRY", value: "TRY" },
                            { name: "BRL", value: "BRL" },
                            { name: "TWD", value: "TWD" },
                            { name: "DKK", value: "DKK" },
                            { name: "PLN", value: "PLN" },
                            { name: "THB", value: "THB" },
                            { name: "IDR", value: "IDR" }
                        )
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('to')
                        .setDescription('The currency to convert to.')
                        .addChoices(
                            { name: "USD", value: "USD" },
                            { name: "EUR", value: "EUR" },
                            { name: "JPY", value: "JPY" },
                            { name: "GBP", value: "GBP" },
                            { name: "AUD", value: "AUD" },
                            { name: "CAD", value: "CAD" },
                            { name: "CHF", value: "CHF" },
                            { name: "CNY", value: "CNY" },
                            { name: "HKD", value: "HKD" },
                            { name: "NZD", value: "NZD" },
                            { name: "SEK", value: "SEK" },
                            { name: "KRW", value: "KRW" },
                            { name: "SGD", value: "SGD" },
                            { name: "NOK", value: "NOK" },
                            { name: "MXN", value: "MXN" },
                            { name: "INR", value: "INR" },
                            { name: "RUB", value: "RUB" },
                            { name: "ZAR", value: "ZAR" },
                            { name: "TRY", value: "TRY" },
                            { name: "BRL", value: "BRL" },
                            { name: "TWD", value: "TWD" },
                            { name: "DKK", value: "DKK" },
                            { name: "PLN", value: "PLN" },
                            { name: "THB", value: "THB" },
                            { name: "IDR", value: "IDR" }
                        )
                        .setRequired(true))),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'currency') {
			const amount = interaction.options.getNumber('value');
			const fromCurrency = interaction.options.getString('from');
			const toCurrency = interaction.options.getString('to');

			const headers = new Headers();
			headers.append('apikey', Currency_Data_API);

			try {
				const response = await fetch(
					`https://api.apilayer.com/currency_data/convert?to=${toCurrency}&from=${fromCurrency}&amount=${amount}`,
					{ method: 'GET', headers }
				);
				const data = await response.json();

				if (!data || data.error) {
					return interaction.reply({
						content: 'Error fetching conversion data. Please try again later.',
						ephemeral: true
					});
				}

				const convertedAmount = data.result.toFixed(2);
				return interaction.reply(
					`**${amount}** ${fromCurrency} is approximately **${convertedAmount}** ${toCurrency}.`
				);
			} catch (error) {
				console.error('Error fetching conversion data:', error);
				return interaction.reply({
					content: 'An unexpected error occurred while fetching conversion data.',
					ephemeral: true
				});
			}
		}
	}
};
