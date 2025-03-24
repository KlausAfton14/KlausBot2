//CONSTs

const fs = require('node:fs');
const path = require('node:path');
const { Discord, Client, Collection, GatewayIntentBits, Events } = require('discord.js');
const { token } = require('./config.json');
const mongoose = require('mongoose');
const MangoDB_SRV = 'mongodb+srv://klausafton:2JmSovAEcE0Mjqz0@klausbot.5zvkd.mongodb.net/?retryWrites=true&w=majority&appName=KlausBot';
const ProfileModels = require('./models/profileSchema');
const GuildModels = require('./models/guildSchema');
const MimicModels = require('./models/mimicSchema');

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages
	] 
});

client.cooldowns = new Collection();

//EVENT HANDLER

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

//COMMAND HANDLER

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		command.data.folder = folder;
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


//interactionCreate

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	if (interaction.channel === null || interaction.channel === 'dm') return; 

	const profileData = await ProfileModels.findOne({ userID: interaction.user.id });
	const guildData = await GuildModels.findOne({ guildID: interaction.guild.id });
	try {
	  
	  if (!profileData) {
		let profile = await ProfileModels.create({
		  userName: interaction.user.tag,
		  userID: interaction.user.id,
		  coins: 1000,
		  bank: 0,
		});
		profile.save();
	  }
	} catch (err) {
	  console.log(err);
	}

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, profileData, guildData, client);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


//MongoDB

mongoose.connect(MangoDB_SRV, { useNewUrlParser: true, useUnifiedTopology: true 
}).then(() => {console.log ('MongoDB connected')
}).catch(err => {console.log(err)});

//LOGIN

client.login(token);

