const fs = require('node:fs');
const { readdir, stat } = require('fs/promises');
const { join } = require('path');
const moment = require('moment');
const wait = require('node:timers/promises').setTimeout;
 
module.exports = {
    name: 'messageCreate',
    async execute(message) {

        if (message.channel.type === 'DM') return;
        if (!message.guild) return;
        if (message.author.tag === 'Carl-bot Logging#0000') return;
        const guildInfo = `${(await message.guild.fetchOwner()).user.tag}_${message.guild.id}`;
        const channelInfo = message.channel.id;

        if (fs.existsSync(`./logs/${guildInfo}`)) {

            const msgTime = moment(message.createdAt).format("DD/MM/YYYY LTS");

            if (message.embeds.length > 0) {
                fs.appendFileSync(`./logs/${guildInfo}/${channelInfo}.txt`, `\n
                    AUTHOR:      ${message.author.nickname} / ${message.author.id}\n
                    CREATED AT:  ${msgTime}\n
                    ID:          ${message.id}\n
                    LINK:        ${message.id}\n`);
                for (let embed of message.embeds) {

                    fs.appendFileSync(`./logs/${guildInfo}/${channelInfo}.txt`, `
                        Title: ${embed.title}\n
                        Description: ${embed.description}`);
                    for (let field of embed.fields) {
                        fs.appendFileSync(`./logs/${guildInfo}/${channelInfo}.txt`,`
                            Field title: ${field.name}\n
                            Field value: ${field.value}\n`);
                    }
                    
                }
                fs.appendFileSync(`./logs/${guildInfo}/${channelInfo}.txt`, '\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n');
            } else {
            fs.appendFileSync(`./logs/${guildInfo}/${channelInfo}.txt`, `\n
                AUTHOR:      ${message.author.nickname} / ${message.author.id}\n
                CONTENT:     ${message.content}\n
                CREATED AT:  ${msgTime}\n
                ID:          ${message.id}\n
                LINK:        ${message.url}\n` + `\n
                - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n`);
            }        
        } else {
            fs.mkdirSync(`./logs/${guildInfo}`);
        }

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
            const size = await dirSize( './logs' );
            console.log((size / 1024).toFixed(2) + ' Kb');
          } )();
    },
};