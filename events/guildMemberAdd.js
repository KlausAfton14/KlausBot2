const {EmbedBuilder} = require("@discordjs/builders");
const {GuildMember, Embed, InteractionCollector} = require("discord.js");
const GuildModels = require('../models/guildSchema');
const ProfileModels = require('../models/profileSchema');

module.exports = {
    name: "guildMemberAdd",
    async execute(member) {

        const {user, guild} = member;
        const guildData = await GuildModels.findOne({ guildID: guild.id });
        const profileData = await ProfileModels.findOne({ userID: member.id });
	    try {
	  
	    if (!profileData) {
		    let profile = await ProfileModels.create({
		      userName: user.tag,
		      userID: user.id,
		      coins: 1000,
		      bank: 0,
		    });
		    profile.save();
	    }
	    } catch (err) {
	      console.log(err);
	    }

        
        const welcomeChannel = member.guild.channels.cache.get(guildData.welcomeChannelId);
        if (!welcomeChannel | welcomeChannel === '0') {
			return;
		} else {
			const newEmbed = new EmbedBuilder()
			.setTitle(`${guildData.welcomeMessage.toString()}`)
			.setAuthor({name: member.user, iconURL: member.user.displayAvatarURL( {dynamic: true} )})
			.setDescription('🤯')
			.addFields({ name: 'Total members count', value: `${member.guild.memberCount}`, inline: true})
			.setColor(0x23FF00)
			.setFooter({text: 'KlausBot 2.0'})
			.setTimestamp();

			welcomeChannel.send({ embeds: [newEmbed] });
		}
    }
}
