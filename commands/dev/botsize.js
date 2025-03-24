const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { readdir, stat } = require('fs/promises');
const { join } = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bot_size')
		.setDescription('Show the size of this whole bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {

    if (interaction.user.id.toString() !== '659762420327120936') return interaction.reply({ content: "You are not Klaus!!", ephemeral: true });
    
        const dirSize = async dir => {
            const files = await readdir( dir, { withFileTypes: true } );
          
            const paths = files.map( async file => {
              const path = join( dir, file.name );
          
              if ( file.isDirectory() ) return await dirSize( path );
          
              if ( file.isFile() ) {
                const { size } = await stat( path );
                
                return size;
              }
          
              return 0;
            } );
          
            return ( await Promise.all( paths ) ).flat( Infinity ).reduce( ( i, size ) => i + size, 0 );
          }

          ( async () => {
            const size = await dirSize( '../discordbot' );
            sizeMb = (size / 1024 / 1024).toFixed(2);
            sizeKb = (size / 1024).toFixed(2);
            
            await interaction.reply({ content: `This bot has size of **${sizeMb}** in *megabytes (Mb)*, **${sizeKb}** in *kilobytes (Kb)* and **${size}** in *bytes*`});
            
          } )();

	},
};