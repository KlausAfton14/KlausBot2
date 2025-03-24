const GuildModels = require('../models/guildSchema');

module.exports = {
    name: "guildCreate",
    async execute(guild) {
        
    	const guildData = await GuildModels.findOne({ guildID: guild.id });
	    try {
	  
    	  if (!guildData) {
    		let profile = await GuildModels.create({
    		  guildName: guild.name,
    		  guildID: guild.id,
    		  lang: 'english',
			  welcomeMessage: 'Welcome to the server!',
			  welcomeChannelId: '0'
    		});
		    profile.save();
	      }
    	} catch (err) {
    	  console.log(err);
	    }

    }
}
